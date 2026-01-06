import { Store, Phone, Mail, Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useVendors } from '@/hooks/useVendors';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';

const ClientVendors = () => {
  const { user } = useAuth();
  const { clients, isLoading: clientsLoading } = useClients();
  const { vendors, isLoading: vendorsLoading } = useVendors();

  // Fetch client_vendors assignments
  const { data: clientVendors = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['client_vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_vendors')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const isLoading = clientsLoading || vendorsLoading || assignmentsLoading;

  // Get client's own data using user_id
  const myClient = clients.find(c => c.user_id === user?.id);
  
  // Get vendors assigned to this client
  const assignedVendorIds = myClient 
    ? clientVendors.filter(cv => cv.client_id === myClient.id).map(cv => cv.vendor_id)
    : [];
  const assignedVendors = vendors.filter(v => assignedVendorIds.includes(v.id));

  const handleContactVendor = (phone: string | null, vendorName: string) => {
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
      const message = encodeURIComponent(`Halo ${vendorName}, saya ${myClient?.name || 'klien'} dari WedPlan. Saya ingin bertanya tentang layanan untuk acara pernikahan saya.`);
      window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!myClient) {
    return (
      <div className="p-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Vendor Pernikahan</h1>
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
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Vendor Pernikahan Anda</h1>
        <p className="text-muted-foreground">
          Daftar vendor yang telah ditugaskan untuk pernikahan Anda.
        </p>
      </div>

      {/* Vendor Grid */}
      {assignedVendors.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 border border-border text-center">
          <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Vendor</h3>
          <p className="text-muted-foreground">
            Wedding Organizer akan segera menambahkan vendor untuk pernikahan Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedVendors.map((vendor) => (
            <div 
              key={vendor.id} 
              className="bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-card transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="outline" className="bg-pink-100 text-pink-700 border-pink-200">
                  {vendor.category}
                </Badge>
              </div>
              
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {vendor.name}
              </h3>
              
              {vendor.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {vendor.description}
                </p>
              )}

              {/* Rating */}
              {vendor.rating && (
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < (vendor.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">({vendor.rating})</span>
                </div>
              )}

              {/* Price Range */}
              {vendor.price_range && (
                <p className="text-sm text-muted-foreground mb-4">
                  💰 {vendor.price_range}
                </p>
              )}

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                {vendor.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{vendor.email}</span>
                  </div>
                )}
                {vendor.contact && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{vendor.contact}</span>
                  </div>
                )}
              </div>

              {/* Contact Button */}
              {vendor.contact && (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleContactVendor(vendor.contact, vendor.name)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Hubungi via WhatsApp
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientVendors;