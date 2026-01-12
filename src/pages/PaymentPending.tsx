import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PaymentPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl p-8 border border-border shadow-soft text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-yellow-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Menunggu Pembayaran
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Silakan selesaikan pembayaran Anda sesuai instruksi yang diberikan. 
          Status akan diperbarui otomatis setelah pembayaran dikonfirmasi.
        </p>

        <div className="bg-secondary/50 rounded-xl p-4 mb-6">
          <p className="text-sm text-muted-foreground">
            <strong>Tips:</strong> Simpan bukti pembayaran Anda. 
            Proses verifikasi biasanya memakan waktu 1-5 menit.
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => navigate("/dashboard/my-payments")}
            className="w-full"
          >
            Lihat Riwayat Pembayaran
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="w-full"
          >
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;
