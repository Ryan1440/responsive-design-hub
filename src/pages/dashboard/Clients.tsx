import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Mail, Phone, Calendar, Wallet, Store, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/useClients';
import { useClientVendors } from '@/hooks/useClientVendors';
import { useAuth } from '@/hooks/useAuth';
import { Tables } from '@/integrations/supabase/types';
import { Skeleton } from '@/components/ui/skeleton';
import AssignVendorDialog from '@/components/admin/AssignVendorDialog';

type Client = Tables<'clients'>;

const Clients = () => {
  const { clients, isLoading, createClient, deleteClient } = useClients();
  const { clientVendors } = useClientVendors();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    partner: '',
    email: '',
    phone: '',
    eventDate: '',
    venue: '',
    budget: '',
    preferences: '',
  });
  const { toast } = useToast();

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number | null) => {
    if (!value) return 'Rp 0';
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      planning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
    };
    const labels: Record<string, string> = {
      planning: 'Planning',
      'in-progress': 'In Progress',
      completed: 'Completed',
    };
    return (
      <Badge variant="outline" className={styles[status || 'planning'] || styles.planning}>
        {labels[status || 'planning'] || 'Planning'}
      </Badge>
    );
  };

  const getVendorCount = (clientId: string) => {
    return clientVendors.filter(cv => cv.client_id === clientId).length;
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createClient.mutateAsync({
      name: newClient.name,
      partner: newClient.partner,
      email: newClient.email,
      phone: newClient.phone || null,
      event_date: newClient.eventDate,
      venue: newClient.venue || null,
      budget: parseInt(newClient.budget) || 0,
      status: 'planning',
      preferences: newClient.preferences ? newClient.preferences.split(',').map((p) => p.trim()) : null,
      created_by: user?.id || null,
    });

    setNewClient({ name: '', partner: '', email: '', phone: '', eventDate: '', venue: '', budget: '', preferences: '' });
    setIsAddDialogOpen(false);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus klien ini?')) {
      await deleteClient.mutateAsync(clientId);
    }
  };

  const handleOpenAssignDialog = (client: Client) => {
    setSelectedClient(client);
    setIsAssignDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Manajemen Klien</h1>
          <p className="text-muted-foreground">Kelola semua data klien pernikahan Anda.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-button">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Klien
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Tambah Klien Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddClient} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nama Mempelai Wanita</Label>
                  <Input
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder="Sarah"
                    required
                  />
                </div>
                <div>
                  <Label>Nama Mempelai Pria</Label>
                  <Input
                    value={newClient.partner}
                    onChange={(e) => setNewClient({ ...newClient, partner: e.target.value })}
                    placeholder="Mark"
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <Label>Telepon</Label>
                <Input
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <Label>Tanggal Acara</Label>
                <Input
                  type="date"
                  value={newClient.eventDate}
                  onChange={(e) => setNewClient({ ...newClient, eventDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Venue</Label>
                <Input
                  value={newClient.venue}
                  onChange={(e) => setNewClient({ ...newClient, venue: e.target.value })}
                  placeholder="Grand Ballroom Hotel"
                />
              </div>
              <div>
                <Label>Budget (Rp)</Label>
                <Input
                  type="number"
                  value={newClient.budget}
                  onChange={(e) => setNewClient({ ...newClient, budget: e.target.value })}
                  placeholder="150000000"
                />
              </div>
              <div>
                <Label>Preferensi (pisahkan dengan koma)</Label>
                <Input
                  value={newClient.preferences}
                  onChange={(e) => setNewClient({ ...newClient, preferences: e.target.value })}
                  placeholder="Elegant, Romantic, Garden Theme"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent/90"
                disabled={createClient.isPending}
              >
                {createClient.isPending ? 'Menyimpan...' : 'Simpan Klien'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Cari klien..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">Belum Ada Klien</h3>
          <p className="text-muted-foreground mb-4">Mulai tambahkan klien pernikahan pertama Anda.</p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-accent hover:bg-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Klien Pertama
          </Button>
        </div>
      )}

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-card transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {client.name} & {client.partner}
                </h3>
                {getStatusBadge(client.status)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-secondary rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleOpenAssignDialog(client)}>
                    <Store className="w-4 h-4 mr-2" />
                    Assign Vendor
                  </DropdownMenuItem>
                  <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(client.event_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="w-4 h-4" />
                <span>{formatCurrency(client.budget)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Store className="w-4 h-4" />
                <span>{getVendorCount(client.id)} vendor ter-assign</span>
              </div>
            </div>

            {client.preferences && client.preferences.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {client.preferences.slice(0, 3).map((pref) => (
                    <span
                      key={pref}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Assign Button */}
            <div className="mt-4 pt-4 border-t border-border">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleOpenAssignDialog(client)}
              >
                <Store className="w-4 h-4 mr-2" />
                Kelola Vendor
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Vendor Dialog */}
      <AssignVendorDialog
        client={selectedClient}
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
      />
    </div>
  );
};

export default Clients;