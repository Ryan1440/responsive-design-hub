-- Add Midtrans-related columns to payments table
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS midtrans_order_id TEXT,
ADD COLUMN IF NOT EXISTS midtrans_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_midtrans_order_id ON public.payments(midtrans_order_id);