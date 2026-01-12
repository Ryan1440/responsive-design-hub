import { Wallet, CheckCircle, Clock, AlertCircle, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { usePayments } from '@/hooks/usePayments';
import { useVendors } from '@/hooks/useVendors';
import { useMidtrans } from '@/hooks/useMidtrans';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';

const ClientPayments = () => {
  const { user } = useAuth();
  const { clients, isLoading: clientsLoading } = useClients();
  const { payments, isLoading: paymentsLoading } = usePayments();
  const { vendors, isLoading: vendorsLoading } = useVendors();
  const { payWithMidtrans, isLoading: paymentProcessing } = useMidtrans();
  const queryClient = useQueryClient();

  const isLoading = clientsLoading || paymentsLoading || vendorsLoading;

  // Get client's own data using user_id
  const myClient = clients.find(c => c.user_id === user?.id);
  
  // Get payments for this client
  const myPayments = myClient ? payments.filter(p => p.client_id === myClient.id) : [];

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const getVendorName = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor?.name || 'Unknown Vendor';
  };

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

  const handlePayment = (paymentId: string) => {
    payWithMidtrans(paymentId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payments'] });
      },
      onPending: () => {
        queryClient.invalidateQueries({ queryKey: ['payments'] });
      },
    });
  };

  // Calculate totals
  const totalPaid = myPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = myPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = myPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
  const totalAll = myPayments.reduce((sum, p) => sum + p.amount, 0);
  const paymentProgress = totalAll > 0 ? (totalPaid / totalAll) * 100 : 0;

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!myClient) {
    return (
      <div className="p-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Riwayat Pembayaran</h1>
        <div className="text-center py-12 bg-card rounded-2xl border border-border">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Data tidak ditemukan</h3>
          <p className="text-muted-foreground">Akun Anda belum terhubung dengan data klien.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Riwayat Pembayaran</h1>
        <p className="text-muted-foreground">Lihat status pembayaran untuk pernikahan Anda.</p>
      </div>

      {/* Summary Card */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Ringkasan Pembayaran
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress Pembayaran</span>
                  <span className="font-medium text-foreground">{Math.round(paymentProgress)}%</span>
                </div>
                <Progress value={paymentProgress} className="h-3" />
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">Total Biaya</span>
                <span className="text-xl font-bold text-foreground">{formatCurrency(totalAll)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">Sudah Dibayar</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-700 font-medium">Sisa Pembayaran</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending + totalOverdue)}</p>
          </div>
        </div>
      </div>

      {/* Payment List */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Daftar Pembayaran</h2>
          <Wallet className="w-5 h-5 text-muted-foreground" />
        </div>

        {myPayments.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Belum ada data pembayaran</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myPayments.map((payment) => (
              <div
                key={payment.id}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  payment.status === 'paid' 
                    ? 'bg-green-50/50 border-green-200' 
                    : payment.status === 'overdue'
                    ? 'bg-red-50/50 border-red-200'
                    : 'bg-secondary/50 border-border'
                }`}
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(payment.status)}
                  <div>
                    <p className="font-semibold text-foreground">{getVendorName(payment.vendor_id)}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="bg-pink-100 text-pink-700 border-0">
                        {payment.type === 'dp' ? 'DP' : payment.type === 'installment' ? 'Cicilan' : 'Full'}
                      </Badge>
                      {payment.due_date && (
                        <span>
                          Due: {new Date(payment.due_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                    {payment.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{payment.notes}</p>
                    )}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-bold text-lg text-foreground">{formatCurrency(payment.amount)}</p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(payment.status)}
                    {(payment.status === 'pending' || payment.status === 'overdue') && (
                      <Button
                        size="sm"
                        onClick={() => handlePayment(payment.id)}
                        disabled={paymentProcessing}
                        className="gap-1"
                      >
                        <CreditCard className="w-4 h-4" />
                        Bayar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPayments;