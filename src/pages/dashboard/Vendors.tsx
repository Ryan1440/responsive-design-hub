import { useState } from 'react';
import { Plus, Search, Filter, Star, Phone, Mail, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockVendors, Vendor } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const categories = [
  { value: 'catering', label: 'Catering' },
  { value: 'photography', label: 'Photography' },
  { value: 'decoration', label: 'Decoration' },
  { value: 'makeup', label: 'Makeup' },
  { value: 'music', label: 'Music' },
  { value: 'venue', label: 'Venue' },
  { value: 'invitation', label: 'Invitation' },
  { value: 'other', label: 'Other' },
];

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    category: '',
    contact: '',
    email: '',
    priceRange: '',
    description: '',
  });
  const { toast } = useToast();

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      catering: '🍽️',
      photography: '📷',
      decoration: '💐',
      makeup: '💄',
      music: '🎵',
      venue: '🏛️',
      invitation: '💌',
      other: '✨',
    };
    return icons[category] || '✨';
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor: Vendor = {
      id: String(vendors.length + 1),
      name: newVendor.name,
      category: newVendor.category as Vendor['category'],
      contact: newVendor.contact,
      email: newVendor.email,
      priceRange: newVendor.priceRange,
      rating: 0,
      status: 'active',
      description: newVendor.description,
    };
    setVendors([...vendors, vendor]);
    setNewVendor({ name: '', category: '', contact: '', email: '', priceRange: '', description: '' });
    setIsAddDialogOpen(false);
    toast({
      title: 'Vendor Ditambahkan',
      description: `${vendor.name} berhasil ditambahkan.`,
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Manajemen Vendor</h1>
          <p className="text-muted-foreground">Kelola daftar vendor dan partner kerja sama Anda.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-rose-gold-dark text-accent-foreground shadow-button">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Tambah Vendor Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddVendor} className="space-y-4 mt-4">
              <div>
                <Label>Nama Vendor</Label>
                <Input
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  placeholder="Nama Vendor"
                  required
                />
              </div>
              <div>
                <Label>Kategori</Label>
                <Select
                  value={newVendor.category}
                  onValueChange={(value) => setNewVendor({ ...newVendor, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  placeholder="email@vendor.com"
                  required
                />
              </div>
              <div>
                <Label>Telepon</Label>
                <Input
                  value={newVendor.contact}
                  onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>
              <div>
                <Label>Range Harga</Label>
                <Input
                  value={newVendor.priceRange}
                  onChange={(e) => setNewVendor({ ...newVendor, priceRange: e.target.value })}
                  placeholder="Rp 10.000.000 - 30.000.000"
                  required
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Textarea
                  value={newVendor.description}
                  onChange={(e) => setNewVendor({ ...newVendor, description: e.target.value })}
                  placeholder="Deskripsi layanan vendor..."
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-rose-gold-dark">
                Simpan Vendor
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
            placeholder="Cari vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Semua ({vendors.length})
        </button>
        {categories.map((cat) => {
          const count = vendors.filter((v) => v.category === cat.value).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {getCategoryIcon(cat.value)} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-card transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-pink-soft flex items-center justify-center text-2xl">
                  {getCategoryIcon(vendor.category)}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{vendor.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{vendor.category}</p>
                </div>
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

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{vendor.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{vendor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{vendor.contact}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-semibold text-foreground">{vendor.rating}</span>
              </div>
              <Badge
                variant="outline"
                className={
                  vendor.status === 'active'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }
              >
                {vendor.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
              </Badge>
            </div>

            <div className="mt-3">
              <p className="text-sm font-medium text-accent">{vendor.priceRange}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vendors;
