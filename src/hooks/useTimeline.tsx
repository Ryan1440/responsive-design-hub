import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type TimelineTask = Tables<'timeline_tasks'>;
type TimelineTaskInsert = TablesInsert<'timeline_tasks'>;
type TimelineTaskUpdate = TablesUpdate<'timeline_tasks'>;

export const useTimeline = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const timelineQuery = useQuery({
    queryKey: ['timeline_tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timeline_tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as TimelineTask[];
    },
  });

  const createTask = useMutation({
    mutationFn: async (task: TimelineTaskInsert) => {
      const { data, error } = await supabase
        .from('timeline_tasks')
        .insert(task)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline_tasks'] });
      toast({ title: 'Task berhasil ditambahkan' });
    },
    onError: (error: Error) => {
      toast({ title: 'Gagal menambahkan task', description: error.message, variant: 'destructive' });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: TimelineTaskUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('timeline_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline_tasks'] });
      toast({ title: 'Task berhasil diperbarui' });
    },
    onError: (error: Error) => {
      toast({ title: 'Gagal memperbarui task', description: error.message, variant: 'destructive' });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('timeline_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline_tasks'] });
      toast({ title: 'Task berhasil dihapus' });
    },
    onError: (error: Error) => {
      toast({ title: 'Gagal menghapus task', description: error.message, variant: 'destructive' });
    },
  });

  return {
    tasks: timelineQuery.data ?? [],
    isLoading: timelineQuery.isLoading,
    error: timelineQuery.error,
    createTask,
    updateTask,
    deleteTask,
  };
};
