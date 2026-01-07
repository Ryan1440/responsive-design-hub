import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

type ClientVendor = Tables<'client_vendors'>;

export const useClientVendors = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const clientVendorsQuery = useQuery({
    queryKey: ['client_vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ClientVendor[];
    },
  });

  const assignVendor = useMutation({
    mutationFn: async ({ clientId, vendorId }: { clientId: string; vendorId: string }) => {
      const { data, error } = await supabase
        .from('client_vendors')
        .insert({ client_id: clientId, vendor_id: vendorId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client_vendors'] });
      toast({ title: 'Vendor berhasil di-assign ke klien' });
    },
    onError: (error: Error) => {
      toast({ title: 'Gagal assign vendor', description: error.message, variant: 'destructive' });
    },
  });

  const removeVendorAssignment = useMutation({
    mutationFn: async ({ clientId, vendorId }: { clientId: string; vendorId: string }) => {
      const { error } = await supabase
        .from('client_vendors')
        .delete()
        .eq('client_id', clientId)
        .eq('vendor_id', vendorId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client_vendors'] });
      toast({ title: 'Vendor berhasil dihapus dari klien' });
    },
    onError: (error: Error) => {
      toast({ title: 'Gagal menghapus vendor', description: error.message, variant: 'destructive' });
    },
  });

  const getVendorsForClient = (clientId: string) => {
    return clientVendorsQuery.data?.filter(cv => cv.client_id === clientId) ?? [];
  };

  const getClientsForVendor = (vendorId: string) => {
    return clientVendorsQuery.data?.filter(cv => cv.vendor_id === vendorId) ?? [];
  };

  return {
    clientVendors: clientVendorsQuery.data ?? [],
    isLoading: clientVendorsQuery.isLoading,
    error: clientVendorsQuery.error,
    assignVendor,
    removeVendorAssignment,
    getVendorsForClient,
    getClientsForVendor,
  };
};