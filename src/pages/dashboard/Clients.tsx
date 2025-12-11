import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Mail, Phone, Calendar, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockClients, Client } from '@/data/mockData';
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

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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

  const formatCurrency = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      planning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
    };
    const labels = {
      planning: 'Planning',
      'in-progress': 'In Progress',
      completed: 'Completed',
    };
    return (
      <Badge variant="outline" className={styles[status as keyof typeof styles]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const client: Client = {
      id: String(clients.length + 1),
      name: newClient.name,
      partner: newClient.partner,
      email: newClient.email,
      phone: newClient.phone,
      eventDate: newClient.eventDate,
      venue: newClient.venue,
      budget: parseInt(newClient.budget) || 0,
      status: 'planning',
      preferences: newClient.preferences.split(',').map((p) => p.trim()),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients([...clients, client]);
    setNewClient({ name: '', partner: '', email: '', phone: '', eventDate: '', venue: '', budget: '', preferences: '' });
    setIsAddDialogOpen(false);
    toast({
      title: 'Klien Ditambahkan',
      description: `${client.name} & ${client.partner} berhasil ditambahkan.`,
    });
  };

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
            <Button className="bg-accent hover:bg-rose-gold-dark text-accent-foreground shadow-button">
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
                  required
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
                  required
                />
              </div>
              <div>
                <Label>Budget (Rp)</Label>
                <Input
                  type="number"
                  value={newClient.budget}
                  onChange={(e) => setNewClient({ ...newClient, budget: e.target.value })}
                  placeholder="150000000"
                  required
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
              <Button type="submit" className="w-full bg-accent hover:bg-rose-gold-dark">
                Simpan Klien
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
                  <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(client.eventDate).toLocaleDateString('id-ID', {
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
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {client.preferences.slice(0, 3).map((pref) => (
                  <span
                    key={pref}
                    className="px-2 py-1 text-xs rounded-full bg-pink-soft text-pink-dark"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;
