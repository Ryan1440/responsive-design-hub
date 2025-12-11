import { Users, Store, Calendar, Wallet, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { mockClients, mockPayments, dashboardStats } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';

const Overview = () => {
  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const upcomingEvents = mockClients
    .filter((client) => client.status !== 'completed')
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 3);

  const recentPayments = mockPayments.slice(0, 5);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang kembali! Berikut ringkasan aktivitas Anda.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Klien"
          value={dashboardStats.totalClients}
          icon={Users}
          change="+2 bulan ini"
          changeType="positive"
        />
        <StatCard
          title="Total Vendor"
          value={dashboardStats.totalVendors}
          icon={Store}
          change="8 kategori"
          changeType="neutral"
        />
        <StatCard
          title="Acara Bulan Ini"
          value={dashboardStats.eventsThisMonth}
          icon={Calendar}
          change="2 mendatang"
          changeType="neutral"
        />
        <StatCard
          title="Total Pendapatan"
          value={formatCurrency(dashboardStats.totalRevenue)}
          icon={Wallet}
          change="+15% dari bulan lalu"
          changeType="positive"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">Acara Mendatang</h2>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((client) => {
              const daysUntil = Math.ceil(
                (new Date(client.eventDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              const progress = Math.max(0, Math.min(100, 100 - (daysUntil / 90) * 100));

              return (
                <div key={client.id} className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">
                      {client.name} & {client.partner}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(client.eventDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{client.venue}</p>
                  <div className="flex items-center gap-3">
                    <Progress value={progress} className="flex-1 h-2" />
                    <span className="text-sm font-medium text-accent">
                      H-{daysUntil > 0 ? daysUntil : 0}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">Pembayaran Terbaru</h2>
            <Wallet className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.status === 'paid'
                        ? 'bg-green-100 text-green-600'
                        : payment.status === 'overdue'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {payment.status === 'paid' ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : payment.status === 'overdue' ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{payment.clientName}</p>
                    <p className="text-xs text-muted-foreground">{payment.vendorName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground text-sm">
                    {formatCurrency(payment.amount)}
                  </p>
                  <p
                    className={`text-xs capitalize ${
                      payment.status === 'paid'
                        ? 'text-green-600'
                        : payment.status === 'overdue'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {payment.status === 'paid' ? 'Lunas' : payment.status === 'overdue' ? 'Terlambat' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">Ringkasan Pembayaran</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-green-50">
              <p className="text-2xl font-bold text-green-600">
                {mockPayments.filter((p) => p.status === 'paid').length}
              </p>
              <p className="text-sm text-green-700">Lunas</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-yellow-50">
              <p className="text-2xl font-bold text-yellow-600">
                {mockPayments.filter((p) => p.status === 'pending').length}
              </p>
              <p className="text-sm text-yellow-700">Pending</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-red-50">
              <p className="text-2xl font-bold text-red-600">
                {mockPayments.filter((p) => p.status === 'overdue').length}
              </p>
              <p className="text-sm text-red-700">Terlambat</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">Statistik Klien</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Planning</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{
                      width: `${(mockClients.filter((c) => c.status === 'planning').length / mockClients.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="font-medium text-foreground">
                  {mockClients.filter((c) => c.status === 'planning').length}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">In Progress</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${(mockClients.filter((c) => c.status === 'in-progress').length / mockClients.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="font-medium text-foreground">
                  {mockClients.filter((c) => c.status === 'in-progress').length}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Completed</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${(mockClients.filter((c) => c.status === 'completed').length / mockClients.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="font-medium text-foreground">
                  {mockClients.filter((c) => c.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
