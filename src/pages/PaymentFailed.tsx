import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl p-8 border border-border shadow-soft text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Pembayaran Gagal
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Maaf, pembayaran Anda tidak dapat diproses. 
          Silakan coba lagi atau gunakan metode pembayaran lain.
        </p>

        <div className="bg-secondary/50 rounded-xl p-4 mb-6">
          <p className="text-sm text-muted-foreground">
            Jika Anda mengalami masalah berulang, silakan hubungi Wedding Organizer Anda.
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => navigate("/dashboard/my-payments")}
            className="w-full"
          >
            Coba Bayar Lagi
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate("/dashboard/contact")}
            className="w-full"
          >
            Hubungi WO
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
