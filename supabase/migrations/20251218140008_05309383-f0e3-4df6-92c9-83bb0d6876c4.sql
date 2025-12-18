-- Create SECURITY DEFINER helper functions to fix RLS infinite recursion

-- Function to check if user owns a client record
CREATE OR REPLACE FUNCTION public.user_owns_client(client_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.clients
    WHERE id = client_uuid AND user_id = auth.uid()
  )
$$;

-- Function to check if user owns a vendor record
CREATE OR REPLACE FUNCTION public.user_owns_vendor(vendor_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.vendors
    WHERE id = vendor_uuid AND user_id = auth.uid()
  )
$$;

-- Function to check if vendor is assigned to a client owned by user
CREATE OR REPLACE FUNCTION public.vendor_assigned_to_user_client(vendor_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.client_vendors cv
    JOIN public.clients c ON cv.client_id = c.id
    WHERE cv.vendor_id = vendor_uuid AND c.user_id = auth.uid()
  )
$$;

-- Function to check if client is assigned to a vendor owned by user
CREATE OR REPLACE FUNCTION public.client_assigned_to_user_vendor(client_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.client_vendors cv
    JOIN public.vendors v ON cv.vendor_id = v.id
    WHERE cv.client_id = client_uuid AND v.user_id = auth.uid()
  )
$$;

-- Drop old problematic policies and recreate with helper functions

-- Fix vendors policies
DROP POLICY IF EXISTS "Clients can view vendors in their events" ON public.vendors;
CREATE POLICY "Clients can view vendors in their events" 
ON public.vendors 
FOR SELECT 
USING (public.vendor_assigned_to_user_client(id));

-- Fix client_vendors policies
DROP POLICY IF EXISTS "Clients can view own vendor assignments" ON public.client_vendors;
CREATE POLICY "Clients can view own vendor assignments" 
ON public.client_vendors 
FOR SELECT 
USING (public.user_owns_client(client_id));

DROP POLICY IF EXISTS "Vendors can view their client assignments" ON public.client_vendors;
CREATE POLICY "Vendors can view their client assignments" 
ON public.client_vendors 
FOR SELECT 
USING (public.user_owns_vendor(vendor_id));

-- Fix payments policies
DROP POLICY IF EXISTS "Clients can view own payments" ON public.payments;
CREATE POLICY "Clients can view own payments" 
ON public.payments 
FOR SELECT 
USING (public.user_owns_client(client_id));

DROP POLICY IF EXISTS "Vendors can view their payments" ON public.payments;
CREATE POLICY "Vendors can view their payments" 
ON public.payments 
FOR SELECT 
USING (public.user_owns_vendor(vendor_id));

-- Fix timeline_tasks policies
DROP POLICY IF EXISTS "Clients can view own timeline" ON public.timeline_tasks;
CREATE POLICY "Clients can view own timeline" 
ON public.timeline_tasks 
FOR SELECT 
USING (public.user_owns_client(client_id));

DROP POLICY IF EXISTS "Vendors can view related timelines" ON public.timeline_tasks;
CREATE POLICY "Vendors can view related timelines" 
ON public.timeline_tasks 
FOR SELECT 
USING (public.client_assigned_to_user_vendor(client_id));

-- Add INSERT/UPDATE/DELETE policies for clients (for admin and self-creation)
DROP POLICY IF EXISTS "Users can create own client record" ON public.clients;
CREATE POLICY "Users can create own client record" 
ON public.clients 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own client record" ON public.clients;
CREATE POLICY "Users can update own client record" 
ON public.clients 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add INSERT/UPDATE/DELETE policies for vendors
DROP POLICY IF EXISTS "Users can create own vendor record" ON public.vendors;
CREATE POLICY "Users can create own vendor record" 
ON public.vendors 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own vendor record" ON public.vendors;
CREATE POLICY "Users can update own vendor record" 
ON public.vendors 
FOR UPDATE 
USING (auth.uid() = user_id);