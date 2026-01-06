import { Calendar, Wallet, CheckCircle, Clock, AlertCircle, MessageCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { usePayments } from '@/hooks/usePayments';
import { useTimeline } from '@/hooks/useTimeline';
import { Skeleton } from '@/components/ui/skeleton';

const ClientOverview = () => {
  const { user } = useAuth();
  const { clients, isLoading: clientsLoading } = useClients();
  const { payments, isLoading: paymentsLoading } = usePayments();
  const { tasks, isLoading: tasksLoading } = useTimeline();

  const isLoading = clientsLoading || paymentsLoading || tasksLoading;

  // Get client's own data using user_id
  const myClient = clients.find(c => c.user_id === user?.id);
  
  // Get tasks for this client
  const myTasks = myClient ? tasks.filter(t => t.client_id === myClient.id) : [];
  
  // Get payments for this client
  const myPayments = myClient ? payments.filter(p => p.client_id === myClient.id) : [];

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  // Calculate progress
  const completedTasks = myTasks.filter(t => t.status === 'completed').length;
  const totalTasks = myTasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Calculate payments
  const totalPaid = myPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalDue = myPayments.reduce((sum, p) => sum + p.amount, 0);
  const remainingPayment = totalDue - totalPaid;

  // Days until event
  const daysUntilEvent = myClient 
    ? Math.ceil((new Date(myClient.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleContactWO = () => {
    // Open WhatsApp with a predefined message
    const waNumber = '6281234567890'; // Replace with actual WO number
    const message = encodeURIComponent(`Halo, saya ${myClient?.name || 'klien'} ingin bertanya tentang persiapan pernikahan saya.`);
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!myClient) {
    return (
      <div className="p-8">
        <div className="bg-card rounded-2xl p-8 border border-border text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Data Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-6">
            Sepertinya akun Anda belum terhubung dengan data klien. 
            Silakan hubungi Wedding Organizer untuk bantuan.
          </p>
          <Button onClick={handleContactWO} className="bg-green-600 hover:bg-green-700 text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            Hubungi WO via WhatsApp
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Selamat Datang, {myClient.name} & {myClient.partner}!
        </h1>
        <p className="text-muted-foreground">
          Pantau progres persiapan pernikahan Anda di sini.
        </p>
      </div>

      {/* Event Card */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              {myClient.name} & {myClient.partner}
            </h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(myClient.event_date).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            {myClient.venue && (
              <p className="text-muted-foreground mt-1">{myClient.venue}</p>
            )}
          </div>
          <div className="text-center bg-card rounded-xl p-4 shadow-soft">
            <p className="text-4xl font-bold text-primary">
              {daysUntilEvent > 0 ? daysUntilEvent : 0}
            </p>
            <p className="text-sm text-muted-foreground">Hari Lagi</p>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Task Progress */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">Progress Persiapan</h3>
            <CheckCircle className="w-5 h-5 text-accent" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-secondary"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${progress * 2.51} 251`}
                  className="text-accent"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{completedTasks}/{totalTasks}</p>
              <p className="text-muted-foreground">Tugas Selesai</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-medium text-yellow-600">
                {myTasks.filter(t => t.status === 'pending').length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">In Progress</span>
              <span className="font-medium text-blue-600">
                {myTasks.filter(t => t.status === 'in-progress').length}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">Status Pembayaran</h3>
            <Wallet className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Biaya</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalDue)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-sm text-green-700">Sudah Dibayar</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(totalPaid)}</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3">
                <p className="text-sm text-yellow-700">Sisa Pembayaran</p>
                <p className="text-lg font-bold text-yellow-600">{formatCurrency(remainingPayment)}</p>
              </div>
            </div>
            <Progress value={(totalPaid / totalDue) * 100 || 0} className="h-2" />
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft mb-8">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Tugas Terbaru</h3>
        {myTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Belum ada tugas</p>
        ) : (
          <div className="space-y-3">
            {myTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : task.status === 'in-progress' ? (
                    <Clock className="w-5 h-5 text-blue-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <p className={`font-medium ${task.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {task.title}
                    </p>
                    {task.milestone && (
                      <p className="text-xs text-muted-foreground">{task.milestone}</p>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.status === 'completed' ? 'bg-green-100 text-green-700' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {task.status === 'completed' ? 'Selesai' : 
                   task.status === 'in-progress' ? 'Proses' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact WO */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-1">Ada Pertanyaan?</h3>
            <p className="opacity-90">Hubungi Wedding Organizer kami via WhatsApp</p>
          </div>
          <Button 
            onClick={handleContactWO}
            variant="secondary" 
            className="bg-white text-green-600 hover:bg-white/90"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;