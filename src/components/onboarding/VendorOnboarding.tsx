import { useState } from 'react';
import { Store, Tag, Phone, Mail, FileText, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useVendors } from '@/hooks/useVendors';
import { useToast } from '@/hooks/use-toast';

const VENDOR_CATEGORIES = [
  'Catering',
  'Dekorasi',
  'Fotografer',
  'Videografer',
  'Wedding Dress',
  'MUA (Makeup Artist)',
  'Entertainment',
  'Wedding Cake',
  'Undangan',
  'Lainnya',
];

const VendorOnboarding = () => {
  const { user } = useAuth();
  const { createVendor } = useVendors();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    contact: '',
    email: user?.email || '',
    description: '',
    price_range: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'Anda harus login terlebih dahulu',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.name || !formData.category) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Mohon isi nama bisnis dan kategori',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createVendor.mutateAsync({
        name: formData.name.trim(),
        category: formData.category,
        contact: formData.contact.trim() || null,
        email: formData.email.trim() || null,
        description: formData.description.trim() || null,
        price_range: formData.price_range.trim() || null,
        user_id: user.id,
        status: 'active',
        rating: 0,
      });

      toast({
        title: 'Pendaftaran Berhasil!',
        description: 'Data vendor Anda berhasil disimpan.',
      });

      // Refresh page to show VendorOverview
      window.location.reload();
    } catch (error) {
      console.error('Error creating vendor:', error);
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
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Daftar sebagai Vendor
          </h1>
          <p className="text-muted-foreground">
            Lengkapi profil bisnis Anda untuk mulai menerima klien.
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl p-8 border border-border shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                Nama Bisnis / Vendor
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Contoh: Catering Lezat Nusantara"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Kategori Layanan
              </Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {VENDOR_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Contact & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Nomor WhatsApp
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  placeholder="08123456789"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Bisnis
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="bisnis@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Deskripsi Layanan
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Ceritakan tentang layanan yang Anda tawarkan..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label htmlFor="price_range" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Range Harga (Opsional)
              </Label>
              <Input
                id="price_range"
                name="price_range"
                placeholder="Contoh: Rp 5.000.000 - Rp 15.000.000"
                value={formData.price_range}
                onChange={handleChange}
              />
            </div>

            {/* Submit */}
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Daftar Sekarang'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorOnboarding;
