import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Mail, Phone, Calendar, Wallet, Store, Users, MapPin, Eye, Pencil } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/useClients';
import { useClientVendors } from '@/hooks/useClientVendors';
import { useVendors } from '@/hooks/useVendors';
import { useAuth } from '@/hooks/useAuth';
import { Tables } from '@/integrations/supabase/types';
import { Skeleton } from '@/components/ui/skeleton';
import AssignVendorDialog from '@/components/admin/AssignVendorDialog';

type Client = Tables<'clients'>;

const Clients = () => {
  const { clients, isLoading, createClient, updateClient, deleteClient } = useClients();
  const { clientVendors, getVendorsForClient } = useClientVendors();
  const { vendors } = useVendors();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
  const [editClient, setEditClient] = useState({
    id: '',
    name: '',
    partner: '',
    email: '',
    phone: '',
    eventDate: '',
    venue: '',
    budget: '',
    preferences: '',
    status: 'planning',
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

  const getAssignedVendors = (clientId: string) => {
    const assignments = getVendorsForClient(clientId);
    return assignments
      .map(cv => vendors.find(v => v.id === cv.vendor_id))
      .filter(Boolean);
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

  const handleViewDetail = (client: Client) => {
    setSelectedClient(client);
    setIsDetailDialogOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditClient({
      id: client.id,
      name: client.name,
      partner: client.partner,
      email: client.email,
      phone: client.phone || '',
      eventDate: client.event_date,
      venue: client.venue || '',
      budget: client.budget?.toString() || '',
      preferences: client.preferences?.join(', ') || '',
      status: client.status || 'planning',
    });
    setIsEditDialogOpen(true);
  };

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateClient.mutateAsync({
      id: editClient.id,
      name: editClient.name,
      partner: editClient.partner,
      email: editClient.email,
      phone: editClient.phone || null,
      event_date: editClient.eventDate,
      venue: editClient.venue || null,
      budget: parseInt(editClient.budget) || 0,
      status: editClient.status,
      preferences: editClient.preferences ? editClient.preferences.split(',').map(p => p.trim()) : null,
    });

    setIsEditDialogOpen(false);
    toast({ title: 'Klien berhasil diperbarui' });
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
                  <DropdownMenuItem onClick={() => handleViewDetail(client)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Lihat Detail
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleOpenEdit(client)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
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

      {/* Detail Client Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Detail Klien</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6 mt-4">
              {/* Names & Status */}
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {selectedClient.name} & {selectedClient.partner}
                </h2>
                {getStatusBadge(selectedClient.status)}
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Kontak</h4>
                <div className="flex items-center gap-2 text-foreground">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedClient.email}</span>
                </div>
                {selectedClient.phone && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedClient.phone}</span>
                  </div>
                )}
              </div>

              {/* Event Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Acara</h4>
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {new Date(selectedClient.event_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {selectedClient.venue && (
                  <div className="flex items-center gap-2 text-foreground">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedClient.venue}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-foreground">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span>{formatCurrency(selectedClient.budget)}</span>
                </div>
              </div>

              {/* Preferences */}
              {selectedClient.preferences && selectedClient.preferences.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Preferensi</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.preferences.map((pref) => (
                      <Badge key={pref} variant="secondary">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned Vendors */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Vendor Ter-assign ({getVendorCount(selectedClient.id)})
                </h4>
                {getAssignedVendors(selectedClient.id).length > 0 ? (
                  <div className="space-y-2">
                    {getAssignedVendors(selectedClient.id).map((vendor) => (
                      <div key={vendor?.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{vendor?.name}</p>
                          <p className="text-sm text-muted-foreground">{vendor?.category}</p>
                        </div>
                        <Badge variant="outline">{vendor?.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Belum ada vendor yang di-assign.</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    handleOpenEdit(selectedClient);
                  }}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Klien
                </Button>
                <Button
                  className="flex-1 bg-accent hover:bg-accent/90"
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    handleOpenAssignDialog(selectedClient);
                  }}
                >
                  <Store className="w-4 h-4 mr-2" />
                  Assign Vendor
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Klien</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditClient} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nama Mempelai Wanita</Label>
                <Input
                  value={editClient.name}
                  onChange={(e) => setEditClient({ ...editClient, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Nama Mempelai Pria</Label>
                <Input
                  value={editClient.partner}
                  onChange={(e) => setEditClient({ ...editClient, partner: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={editClient.email}
                onChange={(e) => setEditClient({ ...editClient, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Telepon</Label>
              <Input
                value={editClient.phone}
                onChange={(e) => setEditClient({ ...editClient, phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Tanggal Acara</Label>
              <Input
                type="date"
                value={editClient.eventDate}
                onChange={(e) => setEditClient({ ...editClient, eventDate: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Venue</Label>
              <Input
                value={editClient.venue}
                onChange={(e) => setEditClient({ ...editClient, venue: e.target.value })}
              />
            </div>
            <div>
              <Label>Budget (Rp)</Label>
              <Input
                type="number"
                value={editClient.budget}
                onChange={(e) => setEditClient({ ...editClient, budget: e.target.value })}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={editClient.status}
                onValueChange={(value) => setEditClient({ ...editClient, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Preferensi (pisahkan dengan koma)</Label>
              <Input
                value={editClient.preferences}
                onChange={(e) => setEditClient({ ...editClient, preferences: e.target.value })}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90"
              disabled={updateClient.isPending}
            >
              {updateClient.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;