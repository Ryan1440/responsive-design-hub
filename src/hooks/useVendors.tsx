import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Vendor = Tables<'vendors'>;
type VendorInsert = TablesInsert<'vendors'>;
type VendorUpdate = TablesUpdate<'vendors'>;

export const useVendors = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const vendorsQuery = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Vendor[];
    },
  });

  const createVendor = useMutation({
    mutationFn: async (vendor: VendorInsert) => {
      const { data, error } = await supabase
        .from('vendors')
        .insert(vendor)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({ title: 'Vendor berhasil ditambahkan' });
    },
    onError: (error: Error) => {
      toast({ title: 'Gagal menambahkan vendor', description: error.message, variant: 'destructive' });
    },
  });

  const updateVendor = useMutation({
    mutationFn: async ({ id, ...updates }: VendorUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('vendors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({ title: 'Vendor berhasil diperbarui' });
    },
    onError: (error: Error) => {
      toast({ title: 'Gagal memperbarui vendor', description: error.message, variant: 'destructive' });
    },
  });

  const deleteVendor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({ title: 'Vendor berhasil dihapus' });
    },
    onError: (error: Error) => {
      toast({ title: 'Gagal menghapus vendor', description: error.message, variant: 'destructive' });
    },
  });

  return {
    vendors: vendorsQuery.data ?? [],
    isLoading: vendorsQuery.isLoading,
    error: vendorsQuery.error,
    createVendor,
    updateVendor,
    deleteVendor,
  };
};
