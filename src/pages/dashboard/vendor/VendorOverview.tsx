import { Calendar, CheckCircle, Clock, AlertCircle, MapPin, Users, ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useVendors } from '@/hooks/useVendors';
import { useClients } from '@/hooks/useClients';
import { useTimeline } from '@/hooks/useTimeline';
import { usePayments } from '@/hooks/usePayments';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const VendorOverview = () => {
  const { user } = useAuth();
  const { vendors, isLoading: vendorsLoading } = useVendors();
  const { clients, isLoading: clientsLoading } = useClients();
  const { tasks, isLoading: tasksLoading, updateTask } = useTimeline();
  const { payments, isLoading: paymentsLoading } = usePayments();

  // Fetch client_vendors assignments
  const { data: clientVendors = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['client_vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_vendors')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const isLoading = vendorsLoading || clientsLoading || tasksLoading || paymentsLoading || assignmentsLoading;

  // Get vendor's own data using user_id
  const myVendor = vendors.find(v => v.user_id === user?.id);

  // Get clients assigned to this vendor
  const assignedClientIds = myVendor 
    ? clientVendors.filter(cv => cv.vendor_id === myVendor.id).map(cv => cv.client_id)
    : [];
  const assignedClients = clients.filter(c => assignedClientIds.includes(c.id));

  // Get tasks for assigned clients (vendor can update these)
  const myTasks = tasks.filter(t => assignedClientIds.includes(t.client_id));

  // Get payments related to this vendor
  const myPayments = myVendor 
    ? payments.filter(p => p.vendor_id === myVendor.id)
    : [];

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    await updateTask.mutateAsync({ id: taskId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!myVendor) {
    return (
      <div className="p-8">
        <div className="bg-card rounded-2xl p-8 border border-border text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Data Tidak Ditemukan</h2>
          <p className="text-muted-foreground">
            Akun Anda belum terhubung dengan data vendor. 
            Silakan hubungi Admin untuk bantuan.
          </p>
        </div>
      </div>
    );
  }

  // Stats
  const upcomingEvents = assignedClients.filter(c => new Date(c.event_date) > new Date()).length;
  const pendingTasks = myTasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
  const totalEarnings = myPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Selamat Datang, {myVendor.name}!
        </h1>
        <p className="text-muted-foreground">
          Kelola acara dan tugas Anda di sini.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Acara Mendatang</p>
              <p className="text-3xl font-bold text-foreground">{upcomingEvents}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Tugas Pending</p>
              <p className="text-3xl font-bold text-foreground">{pendingTasks}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Pendapatan</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalEarnings)}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Events */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Acara yang Ditugaskan</h2>
          <Users className="w-5 h-5 text-muted-foreground" />
        </div>
        
        {assignedClients.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Belum ada acara yang ditugaskan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedClients.map((client) => {
              const daysUntil = Math.ceil(
                (new Date(client.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              const isPast = daysUntil < 0;

              return (
                <div 
                  key={client.id} 
                  className={`p-4 rounded-xl border ${isPast ? 'bg-muted/50 border-muted' : 'bg-secondary/50 border-border'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {client.name} & {client.partner}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(client.event_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        {client.venue && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {client.venue}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant={isPast ? 'secondary' : daysUntil <= 7 ? 'destructive' : 'outline'}>
                      {isPast ? 'Selesai' : `H-${daysUntil}`}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My Tasks */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Tugas Saya</h2>
          <ClipboardList className="w-5 h-5 text-muted-foreground" />
        </div>
        
        {myTasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Tidak ada tugas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myTasks.map((task) => {
              const client = clients.find(c => c.id === task.client_id);
              
              return (
                <div 
                  key={task.id} 
                  className={`p-4 rounded-xl border ${
                    task.status === 'completed' ? 'bg-green-50/50 border-green-200' : 'bg-secondary/50 border-border'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : task.status === 'in-progress' ? (
                        <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      )}
                      <div>
                        <h4 className={`font-medium ${task.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {task.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {client ? `${client.name} & ${client.partner}` : 'Unknown Client'}
                          {task.milestone && ` • ${task.milestone}`}
                        </p>
                        {task.due_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.status !== 'completed' && (
                        <>
                          {task.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}
                              disabled={updateTask.isPending}
                            >
                              Mulai
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                            disabled={updateTask.isPending}
                          >
                            Selesai
                          </Button>
                        </>
                      )}
                      {task.status === 'completed' && (
                        <Badge className="bg-green-100 text-green-700 border-0">Selesai</Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOverview;