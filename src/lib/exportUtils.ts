import * as XLSX from 'xlsx';

export const formatCurrency = (value: number) => {
  return `Rp ${value.toLocaleString('id-ID')}`;
};

export const formatDate = (date: string | null) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Export to CSV
export const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value ?? '');
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
};

// Export to Excel
export const exportToExcel = (data: Record<string, unknown>[], filename: string, sheetName = 'Sheet1') => {
  if (data.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Auto-size columns
  const colWidths = Object.keys(data[0]).map(key => ({
    wch: Math.max(
      key.length,
      ...data.map(row => String(row[key] ?? '').length)
    ) + 2
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Export to PDF (using print)
export const exportToPDF = (title: string, tableId: string) => {
  const printContent = document.getElementById(tableId);
  if (!printContent) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .report-header { margin-bottom: 10px; color: #666; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p class="report-header">Tanggal Export: ${new Date().toLocaleDateString('id-ID')}</p>
        ${printContent.innerHTML}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

// Helper to download blob
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Prepare client data for export
export const prepareClientExportData = (clients: any[]) => {
  return clients.map(client => ({
    'Nama': client.name,
    'Partner': client.partner,
    'Email': client.email,
    'Telepon': client.phone || '-',
    'Tanggal Event': formatDate(client.event_date),
    'Venue': client.venue || '-',
    'Budget': formatCurrency(client.budget || 0),
    'Status': client.status || '-',
  }));
};

// Prepare payment data for export
export const preparePaymentExportData = (payments: any[], clients: any[], vendors: any[]) => {
  return payments.map(payment => {
    const client = clients.find(c => c.id === payment.client_id);
    const vendor = vendors.find(v => v.id === payment.vendor_id);
    return {
      'Klien': client?.name || '-',
      'Vendor': vendor?.name || '-',
      'Jumlah': formatCurrency(payment.amount || 0),
      'Tipe': payment.type || '-',
      'Status': payment.status || '-',
      'Jatuh Tempo': formatDate(payment.due_date),
      'Tanggal Bayar': formatDate(payment.paid_date),
      'Metode': payment.payment_method || '-',
    };
  });
};

// Prepare vendor data for export
export const prepareVendorExportData = (vendors: any[]) => {
  return vendors.map(vendor => ({
    'Nama': vendor.name,
    'Kategori': vendor.category,
    'Kontak': vendor.contact || '-',
    'Email': vendor.email || '-',
    'Range Harga': vendor.price_range || '-',
    'Rating': vendor.rating ? `${vendor.rating}/5` : '-',
    'Status': vendor.status || '-',
  }));
};
