import { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useClients } from '@/hooks/useClients';
import { useVendors } from '@/hooks/useVendors';
import { usePayments } from '@/hooks/usePayments';
import {
  formatCurrency,
  formatDate,
  exportToCSV,
  exportToExcel,
  exportToPDF,
  prepareClientExportData,
  preparePaymentExportData,
  prepareVendorExportData,
} from '@/lib/exportUtils';

type ExportFormat = 'csv' | 'excel' | 'pdf';

const Reports = () => {
  const { clients, isLoading: clientsLoading } = useClients();
  const { vendors, isLoading: vendorsLoading } = useVendors();
  const { payments, isLoading: paymentsLoading } = usePayments();
  const [activeReport, setActiveReport] = useState<string | null>(null);

  const isLoading = clientsLoading || vendorsLoading || paymentsLoading;

  const totalRevenue = (payments || [])
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const handleExport = (reportType: string, format: ExportFormat) => {
    const timestamp = new Date().toISOString().split('T')[0];

    switch (reportType) {
      case 'clients': {
        const data = prepareClientExportData(clients || []);
        const filename = `laporan-klien-${timestamp}`;
        if (format === 'csv') exportToCSV(data, filename);
        else if (format === 'excel') exportToExcel(data, filename, 'Klien');
        else if (format === 'pdf') exportToPDF('Laporan Klien', 'client-report-table');
        break;
      }
      case 'finance': {
        const data = preparePaymentExportData(payments || [], clients || [], vendors || []);
        const filename = `laporan-keuangan-${timestamp}`;
        if (format === 'csv') exportToCSV(data, filename);
        else if (format === 'excel') exportToExcel(data, filename, 'Keuangan');
        else if (format === 'pdf') exportToPDF('Laporan Keuangan', 'finance-report-table');
        break;
      }
      case 'vendors': {
        const data = prepareVendorExportData(vendors || []);
        const filename = `laporan-vendor-${timestamp}`;
        if (format === 'csv') exportToCSV(data, filename);
        else if (format === 'excel') exportToExcel(data, filename, 'Vendor');
        else if (format === 'pdf') exportToPDF('Laporan Vendor', 'vendor-report-table');
        break;
      }
    }
  };

  const reports = [
    {
      id: 'clients',
      title: 'Laporan Klien Bulanan',
      description: 'Ringkasan data klien dan status acara bulan ini',
      icon: Calendar,
      data: {
        'Total Klien': (clients || []).length,
        'Acara Selesai': (clients || []).filter((c) => c.status === 'completed').length,
        'Dalam Progress': (clients || []).filter((c) => c.status === 'in-progress').length,
        'Planning': (clients || []).filter((c) => c.status === 'planning').length,
      },
    },
    {
      id: 'finance',
      title: 'Laporan Keuangan',
      description: 'Ringkasan pendapatan dan pembayaran',
      icon: TrendingUp,
      data: {
        'Total Pendapatan': formatCurrency(totalRevenue),
        'Pembayaran Lunas': (payments || []).filter((p) => p.status === 'paid').length,
        'Menunggu Pembayaran': (payments || []).filter((p) => p.status === 'pending').length,
        'Pembayaran Terlambat': (payments || []).filter((p) => p.status === 'overdue').length,
      },
    },
    {
      id: 'vendors',
      title: 'Laporan Vendor',
      description: 'Statistik vendor dan kategori',
      icon: FileText,
      data: {
        'Total Vendor': (vendors || []).length,
        'Vendor Aktif': (vendors || []).filter((v) => v.status === 'active').length,
        'Kategori': [...new Set((vendors || []).map((v) => v.category))].length,
        'Rating Rata-rata': (vendors || []).length > 0
          ? ((vendors || []).reduce((sum, v) => sum + (v.rating || 0), 0) / (vendors || []).length).toFixed(1)
          : '0',
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card">
                  <DropdownMenuItem onClick={() => handleExport(report.id, 'csv')}>
                    Export CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport(report.id, 'excel')}>
                    Export Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setActiveReport(report.id);
                    setTimeout(() => handleExport(report.id, 'pdf'), 100);
                  }}>
                    Export PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

      {/* Hidden Tables for PDF Export */}
      <div className="hidden">
        {/* Client Report Table */}
        <div id="client-report-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Tanggal Event</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(clients || []).map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.partner}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone || '-'}</TableCell>
                  <TableCell>{formatDate(client.event_date)}</TableCell>
                  <TableCell>{client.venue || '-'}</TableCell>
                  <TableCell>{formatCurrency(client.budget || 0)}</TableCell>
                  <TableCell>{client.status || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Finance Report Table */}
        <div id="finance-report-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Klien</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Tanggal Bayar</TableHead>
                <TableHead>Metode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(payments || []).map((payment) => {
                const client = (clients || []).find(c => c.id === payment.client_id);
                const vendor = (vendors || []).find(v => v.id === payment.vendor_id);
                return (
                  <TableRow key={payment.id}>
                    <TableCell>{client?.name || '-'}</TableCell>
                    <TableCell>{vendor?.name || '-'}</TableCell>
                    <TableCell>{formatCurrency(payment.amount || 0)}</TableCell>
                    <TableCell>{payment.type || '-'}</TableCell>
                    <TableCell>{payment.status || '-'}</TableCell>
                    <TableCell>{formatDate(payment.due_date)}</TableCell>
                    <TableCell>{formatDate(payment.paid_date)}</TableCell>
                    <TableCell>{payment.payment_method || '-'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Vendor Report Table */}
        <div id="vendor-report-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Range Harga</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(vendors || []).map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>{vendor.category}</TableCell>
                  <TableCell>{vendor.contact || '-'}</TableCell>
                  <TableCell>{vendor.email || '-'}</TableCell>
                  <TableCell>{vendor.price_range || '-'}</TableCell>
                  <TableCell>{vendor.rating ? `${vendor.rating}/5` : '-'}</TableCell>
                  <TableCell>{vendor.status || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-secondary/50 rounded-2xl p-8 text-center">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          Export Laporan
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Pilih format export: CSV untuk spreadsheet, Excel untuk Microsoft Excel, atau PDF untuk dokumen cetak.
        </p>
      </div>
    </div>
  );
};

export default Reports;
