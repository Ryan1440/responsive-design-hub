import { Shield, User, Store } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type AppRole = 'admin' | 'client' | 'vendor';

interface RoleSelectorProps {
  open: boolean;
  roles: AppRole[];
  onSelectRole: (role: AppRole) => void;
}

const roleConfig = {
  admin: {
    title: 'Administrator',
    description: 'Kelola semua data klien, vendor, dan sistem',
    icon: Shield,
    color: 'text-red-500',
    bgColor: 'bg-red-50 hover:bg-red-100 border-red-200',
  },
  client: {
    title: 'Klien',
    description: 'Lihat timeline, pembayaran, dan vendor Anda',
    icon: User,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
  },
  vendor: {
    title: 'Vendor',
    description: 'Kelola layanan dan lihat klien yang ditugaskan',
    icon: Store,
    color: 'text-green-500',
    bgColor: 'bg-green-50 hover:bg-green-100 border-green-200',
  },
};

const RoleSelector = ({ open, roles, onSelectRole }: RoleSelectorProps) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center">Pilih Role</DialogTitle>
          <DialogDescription className="text-center">
            Anda memiliki beberapa role. Pilih role yang ingin digunakan saat ini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {roles.map((role) => {
            const config = roleConfig[role];
            const Icon = config.icon;
            return (
              <Card
                key={role}
                className={`cursor-pointer transition-all ${config.bgColor}`}
                onClick={() => onSelectRole(role)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-background ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{config.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {config.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelector;
