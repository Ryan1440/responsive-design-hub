import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHash } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const notification = await req.json();
    console.log("Received Midtrans notification:", JSON.stringify(notification));

    const {
      order_id,
      transaction_id,
      transaction_status,
      fraud_status,
      payment_type,
      gross_amount,
      signature_key,
      status_code,
    } = notification;

    // Validate signature
    const expectedSignature = createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      console.error("Invalid signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Signature validated successfully");

    // Find payment by Midtrans order ID
    const { data: payment, error: findError } = await supabase
      .from("payments")
      .select("*")
      .eq("midtrans_order_id", order_id)
      .single();

    if (findError || !payment) {
      console.error("Payment not found for order_id:", order_id, findError);
      return new Response(
        JSON.stringify({ error: "Payment not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine payment status based on Midtrans transaction status
    let newStatus = payment.status;

    if (transaction_status === "capture" || transaction_status === "settlement") {
      if (fraud_status === "accept" || !fraud_status) {
        newStatus = "paid";
      }
    } else if (transaction_status === "pending") {
      newStatus = "pending";
    } else if (
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire"
    ) {
      newStatus = "overdue"; // Using overdue as failed state
    }

    console.log(`Updating payment ${payment.id} status from ${payment.status} to ${newStatus}`);

    // Update payment with transaction details
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: newStatus,
        midtrans_transaction_id: transaction_id,
        payment_method: payment_type,
        paid_date: newStatus === "paid" ? new Date().toISOString() : null,
      })
      .eq("id", payment.id);

    if (updateError) {
      console.error("Failed to update payment:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update payment" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Payment updated successfully");

    return new Response(
      JSON.stringify({ status: "ok" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
