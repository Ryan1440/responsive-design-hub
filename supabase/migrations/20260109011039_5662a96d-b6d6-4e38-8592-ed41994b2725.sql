-- Drop existing RESTRICTIVE policies on vendors
DROP POLICY IF EXISTS "Admins can do everything on vendors" ON public.vendors;
DROP POLICY IF EXISTS "Clients can view vendors in their events" ON public.vendors;
DROP POLICY IF EXISTS "Vendors can view own data" ON public.vendors;
DROP POLICY IF EXISTS "Users can create own vendor record" ON public.vendors;
DROP POLICY IF EXISTS "Users can update own vendor record" ON public.vendors;

-- Drop existing RESTRICTIVE policies on clients
DROP POLICY IF EXISTS "Admins can do everything on clients" ON public.clients;
DROP POLICY IF EXISTS "Clients can view own data" ON public.clients;
DROP POLICY IF EXISTS "Users can create own client record" ON public.clients;
DROP POLICY IF EXISTS "Users can update own client record" ON public.clients;

-- Drop existing RESTRICTIVE policies on client_vendors
DROP POLICY IF EXISTS "Admins can do everything on client_vendors" ON public.client_vendors;
DROP POLICY IF EXISTS "Clients can view own vendor assignments" ON public.client_vendors;
DROP POLICY IF EXISTS "Vendors can view their client assignments" ON public.client_vendors;

-- Drop existing RESTRICTIVE policies on payments
DROP POLICY IF EXISTS "Admins can do everything on payments" ON public.payments;
DROP POLICY IF EXISTS "Clients can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Vendors can view their payments" ON public.payments;

-- Drop existing RESTRICTIVE policies on timeline_tasks
DROP POLICY IF EXISTS "Admins can do everything on timeline_tasks" ON public.timeline_tasks;
DROP POLICY IF EXISTS "Clients can view own timeline" ON public.timeline_tasks;
DROP POLICY IF EXISTS "Vendors can view related timelines" ON public.timeline_tasks;

-- Create PERMISSIVE policies for vendors
CREATE POLICY "Admins can do everything on vendors"
ON public.vendors FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view vendors in their events"
ON public.vendors FOR SELECT TO authenticated
USING (vendor_assigned_to_user_client(id));

CREATE POLICY "Vendors can view own data"
ON public.vendors FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create own vendor record"
ON public.vendors FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vendor record"
ON public.vendors FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Create PERMISSIVE policies for clients
CREATE POLICY "Admins can do everything on clients"
ON public.clients FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view own data"
ON public.clients FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create own client record"
ON public.clients FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own client record"
ON public.clients FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Create PERMISSIVE policies for client_vendors
CREATE POLICY "Admins can do everything on client_vendors"
ON public.client_vendors FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view own vendor assignments"
ON public.client_vendors FOR SELECT TO authenticated
USING (user_owns_client(client_id));

CREATE POLICY "Vendors can view their client assignments"
ON public.client_vendors FOR SELECT TO authenticated
USING (user_owns_vendor(vendor_id));

-- Create PERMISSIVE policies for payments
CREATE POLICY "Admins can do everything on payments"
ON public.payments FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view own payments"
ON public.payments FOR SELECT TO authenticated
USING (user_owns_client(client_id));

CREATE POLICY "Vendors can view their payments"
ON public.payments FOR SELECT TO authenticated
USING (user_owns_vendor(vendor_id));

-- Create PERMISSIVE policies for timeline_tasks
CREATE POLICY "Admins can do everything on timeline_tasks"
ON public.timeline_tasks FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view own timeline"
ON public.timeline_tasks FOR SELECT TO authenticated
USING (user_owns_client(client_id));

CREATE POLICY "Vendors can view related timelines"
ON public.timeline_tasks FOR SELECT TO authenticated
USING (client_assigned_to_user_vendor(client_id));