import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Heart, MapPin, Phone, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useToast } from '@/hooks/use-toast';

const ClientOnboarding = () => {
  const { user } = useAuth();
  const { createClient } = useClients();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    partner: '',
    event_date: '',
    venue: '',
    phone: '',
    budget: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !user?.email) {
      toast({
        title: 'Error',
        description: 'Anda harus login terlebih dahulu',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.name || !formData.partner || !formData.event_date) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Mohon isi nama, nama pasangan, dan tanggal acara',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createClient.mutateAsync({
        name: formData.name.trim(),
        partner: formData.partner.trim(),
        email: user.email,
        event_date: formData.event_date,
        venue: formData.venue.trim() || null,
        phone: formData.phone.trim() || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        user_id: user.id,
        status: 'planning',
      });

      toast({
        title: 'Selamat!',
        description: 'Data Anda berhasil disimpan. Selamat mempersiapkan pernikahan!',
      });

      // Refresh page to show ClientOverview
      window.location.reload();
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: 'Gagal menyimpan data',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Selamat Datang!
          </h1>
          <p className="text-muted-foreground">
            Mari lengkapi data pernikahan Anda untuk memulai perjalanan bersama kami.
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl p-8 border border-border shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Couple Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Mempelai Pria</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partner">Nama Mempelai Wanita</Label>
                <Input
                  id="partner"
                  name="partner"
                  placeholder="Contoh: Ani Putri"
                  value={formData.partner}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Event Date */}
            <div className="space-y-2">
              <Label htmlFor="event_date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Tanggal Pernikahan
              </Label>
              <Input
                id="event_date"
                name="event_date"
                type="date"
                value={formData.event_date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Venue */}
            <div className="space-y-2">
              <Label htmlFor="venue" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Venue / Lokasi Acara (Opsional)
              </Label>
              <Input
                id="venue"
                name="venue"
                placeholder="Contoh: Hotel Grand Ballroom"
                value={formData.venue}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Nomor WhatsApp (Opsional)
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Contoh: 08123456789"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget" className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Perkiraan Budget (Opsional)
              </Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                placeholder="Contoh: 100000000"
                value={formData.budget}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">Masukkan angka tanpa titik atau koma</p>
            </div>

            {/* Submit */}
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Mulai Perjalanan Pernikahan'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientOnboarding;
