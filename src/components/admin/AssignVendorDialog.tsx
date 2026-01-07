import { useState } from 'react';
import { X, Plus, Store, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tables } from '@/integrations/supabase/types';
import { useVendors } from '@/hooks/useVendors';
import { useClientVendors } from '@/hooks/useClientVendors';

type Client = Tables<'clients'>;
type Vendor = Tables<'vendors'>;

interface AssignVendorDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AssignVendorDialog = ({ client, open, onOpenChange }: AssignVendorDialogProps) => {
  const { vendors } = useVendors();
  const { clientVendors, assignVendor, removeVendorAssignment } = useClientVendors();
  const [isAssigning, setIsAssigning] = useState<string | null>(null);

  if (!client) return null;

  const assignedVendorIds = clientVendors
    .filter(cv => cv.client_id === client.id)
    .map(cv => cv.vendor_id);

  const assignedVendors = vendors.filter(v => assignedVendorIds.includes(v.id));
  const availableVendors = vendors.filter(v => !assignedVendorIds.includes(v.id));

  const handleAssignVendor = async (vendorId: string) => {
    setIsAssigning(vendorId);
    await assignVendor.mutateAsync({ clientId: client.id, vendorId });
    setIsAssigning(null);
  };

  const handleRemoveVendor = async (vendorId: string) => {
    setIsAssigning(vendorId);
    await removeVendorAssignment.mutateAsync({ clientId: client.id, vendorId });
    setIsAssigning(null);
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      'Catering': 'bg-orange-100 text-orange-700',
      'Dekorasi': 'bg-pink-100 text-pink-700',
      'Fotografer': 'bg-blue-100 text-blue-700',
      'Videografer': 'bg-purple-100 text-purple-700',
      'Entertainment': 'bg-green-100 text-green-700',
      'MUA': 'bg-rose-100 text-rose-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            Assign Vendor - {client.name} & {client.partner}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Assigned Vendors */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Vendor Ter-assign ({assignedVendors.length})</h3>
            {assignedVendors.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center bg-secondary/50 rounded-lg">
                Belum ada vendor yang di-assign
              </p>
            ) : (
              <div className="space-y-2">
                {assignedVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Store className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{vendor.name}</p>
                        <Badge variant="outline" className={getCategoryBadgeColor(vendor.category)}>
                          {vendor.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveVendor(vendor.id)}
                      disabled={isAssigning === vendor.id}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Vendors */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Vendor Tersedia ({availableVendors.length})</h3>
            {availableVendors.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center bg-secondary/50 rounded-lg">
                Semua vendor sudah di-assign
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <Store className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{vendor.name}</p>
                        <Badge variant="outline" className={`text-xs ${getCategoryBadgeColor(vendor.category)}`}>
                          {vendor.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignVendor(vendor.id)}
                      disabled={isAssigning === vendor.id}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      {isAssigning === vendor.id ? (
                        <Check className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignVendorDialog;