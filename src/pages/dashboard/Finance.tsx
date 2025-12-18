import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Clock, AlertCircle, CheckCircle, Filter, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StatCard from '@/components/dashboard/StatCard';
import { usePayments } from '@/hooks/usePayments';
import { useClients } from '@/hooks/useClients';
import { useVendors } from '@/hooks/useVendors';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

const Finance = () => {
  const { payments, isLoading: paymentsLoading, createPayment } = usePayments();
  const { clients, isLoading: clientsLoading } = useClients();
  const { vendors, isLoading: vendorsLoading } = useVendors();
  const { userRole } = useAuth();
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterClient, setFilterClient] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    clientId: '',
    vendorId: '',
    amount: '',
    type: 'dp',
    dueDate: '',
    notes: '',
  });

  const isAdmin = userRole === 'admin';
  const isLoading = paymentsLoading || clientsLoading || vendorsLoading;

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesClient = filterClient === 'all' || payment.client_id === filterClient;
    return matchesStatus && matchesClient;
  });

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const totalReceived = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = payments
    .filter((p) => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalAll = payments.reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      paid: 'bg-green-100 text-green-700 border-green-200',
      overdue: 'bg-red-100 text-red-700 border-red-200',
    };
    const labels: Record<string, string> = {
      pending: 'Pending',
      paid: 'Lunas',
      overdue: 'Terlambat',
    };
    return (
      <Badge variant="outline" className={styles[status || 'pending']}>
        {labels[status || 'pending']}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      dp: 'DP',
      installment: 'Cicilan',
      full: 'Full Payment',
    };
    return (
      <Badge variant="secondary" className="bg-pink-100 text-pink-700 border-0">
        {labels[type] || type}
      </Badge>
    );
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.name} & ${client.partner}` : 'Unknown Client';
  };

  const getVendorName = (vendorId: string) => {
    const vendor = vendors.find((v) => v.id === vendorId);
    return vendor?.name || 'Unknown Vendor';
  };

  const handleAddPayment = async () => {
    if (!newPayment.clientId || !newPayment.vendorId || !newPayment.amount) return;

    await createPayment.mutateAsync({
      client_id: newPayment.clientId,
      vendor_id: newPayment.vendorId,
      amount: parseFloat(newPayment.amount.replace(/\D/g, '')),
      type: newPayment.type,
      due_date: newPayment.dueDate || null,
      notes: newPayment.notes || null,
      status: 'pending',
    });

    setNewPayment({
      clientId: '',
      vendorId: '',
      amount: '',
      type: 'dp',
      dueDate: '',
      notes: '',
    });
    setIsDialogOpen(false);
  };

  // Group payments by client for budget tracking
  const clientBudgets = clients.map((client) => {
    const clientPayments = payments.filter((p) => p.client_id === client.id);
    const paidAmount = clientPayments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalPlanned = clientPayments.reduce((sum, p) => sum + p.amount, 0);

    return {
      ...client,
      paidAmount,
      totalPlanned,
      progress: totalPlanned > 0 ? (paidAmount / totalPlanned) * 100 : 0,
    };
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Manajemen Keuangan</h1>
          <p className="text-muted-foreground">Pantau pembayaran dan budget klien Anda.</p>
        </div>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pembayaran
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Pembayaran Baru</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Klien</Label>
                  <Select
                    value={newPayment.clientId}
                    onValueChange={(value) => setNewPayment({ ...newPayment, clientId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih klien" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} & {client.partner}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Vendor</Label>
                  <Select
                    value={newPayment.vendorId}
                    onValueChange={(value) => setNewPayment({ ...newPayment, vendorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Jumlah</Label>
                    <Input
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                      placeholder="Rp 5.000.000"
                    />
                  </div>
                  <div>
                    <Label>Tipe</Label>
                    <Select
                      value={newPayment.type}
                      onValueChange={(value) => setNewPayment({ ...newPayment, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dp">DP</SelectItem>
                        <SelectItem value="installment">Cicilan</SelectItem>
                        <SelectItem value="full">Full Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Tanggal Jatuh Tempo</Label>
                  <Input
                    type="date"
                    value={newPayment.dueDate}
                    onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                  />
                </div>
                <Button
                  onClick={handleAddPayment}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={createPayment.isPending}
                >
                  {createPayment.isPending ? 'Menyimpan...' : 'Simpan Pembayaran'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Diterima"
          value={formatCurrency(totalReceived)}
          icon={TrendingUp}
          change={totalAll > 0 ? `${Math.round((totalReceived / totalAll) * 100)}% dari total` : '0%'}
          changeType="positive"
        />
        <StatCard
          title="Menunggu Pembayaran"
          value={formatCurrency(totalPending)}
          icon={Clock}
          change={`${payments.filter((p) => p.status === 'pending').length} transaksi`}
          changeType="neutral"
        />
        <StatCard
          title="Pembayaran Terlambat"
          value={formatCurrency(totalOverdue)}
          icon={AlertCircle}
          change={`${payments.filter((p) => p.status === 'overdue').length} transaksi`}
          changeType="negative"
        />
        <StatCard
          title="Total Semua"
          value={formatCurrency(totalAll)}
          icon={Wallet}
          change={`${payments.length} transaksi`}
          changeType="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment List */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground">Daftar Pembayaran</h2>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="paid">Lunas</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Terlambat</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterClient} onValueChange={setFilterClient}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Klien" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Klien</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} & {client.partner}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredPayments.length === 0 ? (
              <div className="text-center py-8">
                <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Belum ada data pembayaran</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(payment.status)}
                      <div>
                        <p className="font-semibold text-foreground">{getClientName(payment.client_id)}</p>
                        <p className="text-sm text-muted-foreground">{getVendorName(payment.vendor_id)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getTypeBadge(payment.type)}
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{formatCurrency(payment.amount)}</p>
                        {payment.due_date && (
                          <p className="text-xs text-muted-foreground">
                            Due:{' '}
                            {new Date(payment.due_date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                        )}
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Budget Tracking */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">Progress Budget Klien</h2>
            {clientBudgets.filter((c) => c.totalPlanned > 0).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Belum ada data budget</p>
            ) : (
              <div className="space-y-6">
                {clientBudgets
                  .filter((c) => c.totalPlanned > 0)
                  .map((client) => (
                    <div key={client.id}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">
                          {client.name} & {client.partner}
                        </p>
                        <p className="text-sm text-muted-foreground">{Math.round(client.progress)}%</p>
                      </div>
                      <Progress value={client.progress} className="h-2 mb-1" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Dibayar: {formatCurrency(client.paidAmount)}</span>
                        <span>Total: {formatCurrency(client.totalPlanned)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Quick Summary */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Ringkasan</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-green-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-green-700">Lunas</span>
                </div>
                <span className="font-semibold text-green-700">
                  {payments.filter((p) => p.status === 'paid').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-yellow-700">Pending</span>
                </div>
                <span className="font-semibold text-yellow-700">
                  {payments.filter((p) => p.status === 'pending').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-red-700">Terlambat</span>
                </div>
                <span className="font-semibold text-red-700">
                  {payments.filter((p) => p.status === 'overdue').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
