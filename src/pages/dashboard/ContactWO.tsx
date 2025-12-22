import { MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';

const ContactWO = () => {
  const { user } = useAuth();
  const { clients } = useClients();
  
  const myClient = clients.find(c => c.email === user?.email);

  // WO Contact Info - Replace with actual data
  const woContact = {
    name: 'WedPlan Wedding Organizer',
    phone: '6281234567890',
    email: 'info@wedplan.id',
    hours: 'Senin - Sabtu, 09:00 - 18:00 WIB'
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Halo WedPlan,\n\nSaya ${myClient?.name || user?.user_metadata?.full_name || 'klien'} ingin bertanya tentang persiapan pernikahan saya.\n\nTerima kasih.`
    );
    window.open(`https://wa.me/${woContact.phone}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:+${woContact.phone}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('Pertanyaan Persiapan Pernikahan');
    const body = encodeURIComponent(
      `Halo WedPlan,\n\nSaya ${myClient?.name || user?.user_metadata?.full_name || 'klien'} ingin bertanya tentang persiapan pernikahan saya.\n\nTerima kasih.`
    );
    window.open(`mailto:${woContact.email}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Hubungi Wedding Organizer</h1>
        <p className="text-muted-foreground">
          Ada pertanyaan? Jangan ragu untuk menghubungi tim kami.
        </p>
      </div>

      {/* Contact Card */}
      <div className="max-w-2xl">
        <div className="bg-card rounded-2xl p-8 border border-border shadow-soft mb-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              {woContact.name}
            </h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{woContact.hours}</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* WhatsApp - Primary */}
            <Button 
              onClick={handleWhatsApp}
              className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Chat via WhatsApp
            </Button>

            {/* Call */}
            <Button 
              onClick={handleCall}
              variant="outline"
              className="w-full h-14 text-lg"
            >
              <Phone className="w-5 h-5 mr-3" />
              Telepon: +{woContact.phone}
            </Button>

            {/* Email */}
            <Button 
              onClick={handleEmail}
              variant="outline"
              className="w-full h-14 text-lg"
            >
              <Mail className="w-5 h-5 mr-3" />
              Email: {woContact.email}
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-secondary/50 rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-3">Tips untuk Komunikasi Efektif:</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Siapkan pertanyaan Anda sebelum menghubungi
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Sertakan nama dan tanggal acara Anda
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Untuk respon tercepat, gunakan WhatsApp
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Waktu respons: 1-2 jam pada jam kerja
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactWO;