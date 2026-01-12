import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const isProduction = Deno.env.get("MIDTRANS_IS_PRODUCTION") === "true";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { payment_id } = await req.json();

    if (!payment_id) {
      return new Response(
        JSON.stringify({ error: "payment_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Creating Midtrans transaction for payment:", payment_id);

    // Fetch payment details with client info
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select(`
        *,
        clients (
          name,
          email,
          phone
        ),
        vendors (
          name
        )
      `)
      .eq("id", payment_id)
      .single();

    if (paymentError || !payment) {
      console.error("Payment not found:", paymentError);
      return new Response(
        JSON.stringify({ error: "Payment not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate unique order ID
    const orderId = `WO-${payment_id.slice(0, 8)}-${Date.now()}`;

    // Update payment with Midtrans order ID
    const { error: updateError } = await supabase
      .from("payments")
      .update({ midtrans_order_id: orderId })
      .eq("id", payment_id);

    if (updateError) {
      console.error("Failed to update payment:", updateError);
    }

    // Prepare Midtrans transaction payload
    const transactionPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: payment.amount,
      },
      item_details: [
        {
          id: payment.id,
          price: payment.amount,
          quantity: 1,
          name: `${payment.vendors?.name || "Vendor"} - ${
            payment.type === "dp" ? "Down Payment" : 
            payment.type === "installment" ? "Cicilan" : "Pembayaran Penuh"
          }`,
        },
      ],
      customer_details: {
        first_name: payment.clients?.name || "Customer",
        email: payment.clients?.email || "",
        phone: payment.clients?.phone || "",
      },
      callbacks: {
        finish: `${req.headers.get("origin")}/payment/success`,
        error: `${req.headers.get("origin")}/payment/failed`,
        pending: `${req.headers.get("origin")}/payment/pending`,
      },
    };

    console.log("Transaction payload:", JSON.stringify(transactionPayload));

    // Call Midtrans Snap API
    const midtransUrl = isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    const authString = btoa(`${serverKey}:`);

    const midtransResponse = await fetch(midtransUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(transactionPayload),
    });

    const midtransData = await midtransResponse.json();
    console.log("Midtrans response:", JSON.stringify(midtransData));

    if (!midtransResponse.ok) {
      console.error("Midtrans error:", midtransData);
      return new Response(
        JSON.stringify({ error: "Failed to create transaction", details: midtransData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        snap_token: midtransData.token,
        redirect_url: midtransData.redirect_url,
        order_id: orderId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating Midtrans transaction:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
