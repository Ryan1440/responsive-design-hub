import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockClients, mockPayments, mockVendors } from '@/data/mockData';

const Reports = () => {
  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const totalRevenue = mockPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const reports = [
    {
      title: 'Laporan Klien Bulanan',
      description: 'Ringkasan data klien dan status acara bulan ini',
      icon: Calendar,
      data: {
        'Total Klien': mockClients.length,
        'Acara Selesai': mockClients.filter((c) => c.status === 'completed').length,
        'Dalam Progress': mockClients.filter((c) => c.status === 'in-progress').length,
        'Planning': mockClients.filter((c) => c.status === 'planning').length,
      },
    },
    {
      title: 'Laporan Keuangan',
      description: 'Ringkasan pendapatan dan pembayaran',
      icon: TrendingUp,
      data: {
        'Total Pendapatan': formatCurrency(totalRevenue),
        'Pembayaran Lunas': mockPayments.filter((p) => p.status === 'paid').length,
        'Menunggu Pembayaran': mockPayments.filter((p) => p.status === 'pending').length,
        'Pembayaran Terlambat': mockPayments.filter((p) => p.status === 'overdue').length,
      },
    },
    {
      title: 'Laporan Vendor',
      description: 'Statistik vendor dan kategori',
      icon: FileText,
      data: {
        'Total Vendor': mockVendors.length,
        'Vendor Aktif': mockVendors.filter((v) => v.status === 'active').length,
        'Kategori': [...new Set(mockVendors.map((v) => v.category))].length,
        'Rating Rata-rata': (mockVendors.reduce((sum, v) => sum + v.rating, 0) / mockVendors.length).toFixed(1),
      },
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Laporan</h1>
        <p className="text-muted-foreground">Lihat dan unduh laporan aktivitas Anda.</p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.title}
            className="bg-card rounded-2xl p-6 border border-border shadow-soft"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-pink-soft flex items-center justify-center">
                <report.icon className="w-6 h-6 text-pink-dark" />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>

            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              {report.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">{report.description}</p>

            <div className="space-y-3">
              {Object.entries(report.data).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted-foreground">{key}</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="mt-8 bg-secondary/50 rounded-2xl p-8 text-center">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          Laporan Lanjutan Segera Hadir
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Fitur laporan lanjutan dengan grafik interaktif dan export ke berbagai format sedang dalam pengembangan.
        </p>
      </div>
    </div>
  );
};

export default Reports;
