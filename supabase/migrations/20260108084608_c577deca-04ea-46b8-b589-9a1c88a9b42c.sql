-- Update trigger to read selected_role from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  selected_role app_role;
BEGIN
  -- Get role from user metadata, default to 'client'
  selected_role := COALESCE(
    (NEW.raw_user_meta_data ->> 'selected_role')::app_role, 
    'client'
  );
  
  -- Validate: only allow 'client' or 'vendor' from registration
  -- 'admin' can only be assigned manually by existing admin
  IF selected_role NOT IN ('client', 'vendor') THEN
    selected_role := 'client';
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, selected_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;