import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl p-8 border border-border shadow-soft text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Pembayaran Berhasil!
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Terima kasih! Pembayaran Anda telah berhasil diproses. 
          Status pembayaran akan diperbarui secara otomatis.
        </p>

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

export default PaymentSuccess;
