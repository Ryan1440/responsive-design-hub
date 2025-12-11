export interface Client {
  id: string;
  name: string;
  partner: string;
  email: string;
  phone: string;
  eventDate: string;
  venue: string;
  budget: number;
  status: 'planning' | 'in-progress' | 'completed';
  preferences: string[];
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: 'catering' | 'photography' | 'decoration' | 'makeup' | 'music' | 'venue' | 'invitation' | 'other';
  contact: string;
  email: string;
  priceRange: string;
  rating: number;
  status: 'active' | 'inactive';
  description: string;
}

export interface TimelineTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  milestone: 'H-90' | 'H-60' | 'H-30' | 'H-7' | 'H-1' | 'D-Day';
  status: 'pending' | 'in-progress' | 'completed';
  clientId: string;
}

export interface Payment {
  id: string;
  clientId: string;
  clientName: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  type: 'dp' | 'installment' | 'full';
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  paidDate?: string;
}

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah',
    partner: 'Mark',
    email: 'sarah.mark@email.com',
    phone: '081234567890',
    eventDate: '2025-03-15',
    venue: 'Grand Ballroom Hotel',
    budget: 150000000,
    status: 'in-progress',
    preferences: ['Elegant', 'Romantic', 'Garden Theme'],
    createdAt: '2024-12-01',
  },
  {
    id: '2',
    name: 'Emily',
    partner: 'David',
    email: 'emily.david@email.com',
    phone: '081234567891',
    eventDate: '2025-04-20',
    venue: 'Beach Resort Villa',
    budget: 200000000,
    status: 'planning',
    preferences: ['Beach Theme', 'Casual', 'Sunset Ceremony'],
    createdAt: '2024-12-05',
  },
  {
    id: '3',
    name: 'Jessica',
    partner: 'Ryan',
    email: 'jessica.ryan@email.com',
    phone: '081234567892',
    eventDate: '2025-02-14',
    venue: 'Garden Estate',
    budget: 180000000,
    status: 'in-progress',
    preferences: ['Rustic', 'Outdoor', 'Boho Chic'],
    createdAt: '2024-11-20',
  },
  {
    id: '4',
    name: 'Amanda',
    partner: 'Michael',
    email: 'amanda.michael@email.com',
    phone: '081234567893',
    eventDate: '2025-05-10',
    venue: 'Traditional Hall',
    budget: 250000000,
    status: 'planning',
    preferences: ['Traditional', 'Javanese', 'Grand'],
    createdAt: '2024-12-10',
  },
  {
    id: '5',
    name: 'Lisa',
    partner: 'Kevin',
    email: 'lisa.kevin@email.com',
    phone: '081234567894',
    eventDate: '2024-12-28',
    venue: 'City Hotel Rooftop',
    budget: 120000000,
    status: 'completed',
    preferences: ['Modern', 'Minimalist', 'Intimate'],
    createdAt: '2024-09-15',
  },
];

export const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Elegant Catering Co.',
    category: 'catering',
    contact: '081111111111',
    email: 'elegant@catering.com',
    priceRange: 'Rp 150.000 - 300.000/pax',
    rating: 4.8,
    status: 'active',
    description: 'Premium catering service with international and local cuisine options.',
  },
  {
    id: '2',
    name: 'Moments Photography',
    category: 'photography',
    contact: '081222222222',
    email: 'moments@photo.com',
    priceRange: 'Rp 25.000.000 - 50.000.000',
    rating: 4.9,
    status: 'active',
    description: 'Award-winning wedding photography and videography team.',
  },
  {
    id: '3',
    name: 'Bloom & Petals Decoration',
    category: 'decoration',
    contact: '081333333333',
    email: 'bloom@decor.com',
    priceRange: 'Rp 30.000.000 - 80.000.000',
    rating: 4.7,
    status: 'active',
    description: 'Stunning floral arrangements and venue decoration.',
  },
  {
    id: '4',
    name: 'Glamour Makeup Studio',
    category: 'makeup',
    contact: '081444444444',
    email: 'glamour@makeup.com',
    priceRange: 'Rp 8.000.000 - 20.000.000',
    rating: 4.9,
    status: 'active',
    description: 'Professional bridal makeup and hairdo services.',
  },
  {
    id: '5',
    name: 'Harmony Band',
    category: 'music',
    contact: '081555555555',
    email: 'harmony@music.com',
    priceRange: 'Rp 15.000.000 - 35.000.000',
    rating: 4.6,
    status: 'active',
    description: 'Live band and entertainment for your special day.',
  },
  {
    id: '6',
    name: 'Grand Ballroom Hotel',
    category: 'venue',
    contact: '081666666666',
    email: 'events@grandballroom.com',
    priceRange: 'Rp 50.000.000 - 150.000.000',
    rating: 4.8,
    status: 'active',
    description: 'Luxurious ballroom venue with capacity up to 1000 guests.',
  },
  {
    id: '7',
    name: 'Artisan Invitations',
    category: 'invitation',
    contact: '081777777777',
    email: 'artisan@invite.com',
    priceRange: 'Rp 25.000 - 100.000/pcs',
    rating: 4.5,
    status: 'active',
    description: 'Custom wedding invitations and stationery.',
  },
  {
    id: '8',
    name: 'Sweet Delights Cake',
    category: 'other',
    contact: '081888888888',
    email: 'sweet@cake.com',
    priceRange: 'Rp 5.000.000 - 15.000.000',
    rating: 4.7,
    status: 'active',
    description: 'Custom wedding cakes and dessert tables.',
  },
];

export const mockTimelineTasks: TimelineTask[] = [
  { id: '1', title: 'Pilih Venue', description: 'Survey dan booking venue pernikahan', dueDate: '2024-12-20', milestone: 'H-90', status: 'completed', clientId: '1' },
  { id: '2', title: 'Pilih Vendor Catering', description: 'Food tasting dan konfirmasi menu', dueDate: '2024-12-25', milestone: 'H-90', status: 'completed', clientId: '1' },
  { id: '3', title: 'Booking Fotografer', description: 'Diskusi konsep dan package', dueDate: '2024-12-28', milestone: 'H-90', status: 'in-progress', clientId: '1' },
  { id: '4', title: 'Desain Undangan', description: 'Finalisasi desain dan cetak', dueDate: '2025-01-15', milestone: 'H-60', status: 'pending', clientId: '1' },
  { id: '5', title: 'Fitting Gaun Pengantin', description: 'Fitting pertama dan revisi', dueDate: '2025-01-20', milestone: 'H-60', status: 'pending', clientId: '1' },
  { id: '6', title: 'Kirim Undangan', description: 'Distribusi undangan ke tamu', dueDate: '2025-02-01', milestone: 'H-30', status: 'pending', clientId: '1' },
  { id: '7', title: 'Konfirmasi Vendor', description: 'Re-konfirmasi semua vendor', dueDate: '2025-02-15', milestone: 'H-30', status: 'pending', clientId: '1' },
  { id: '8', title: 'Technical Meeting', description: 'Briefing dengan semua vendor', dueDate: '2025-03-08', milestone: 'H-7', status: 'pending', clientId: '1' },
  { id: '9', title: 'Gladi Resik', description: 'Rehearsal ceremony', dueDate: '2025-03-14', milestone: 'H-1', status: 'pending', clientId: '1' },
  { id: '10', title: 'Hari Pernikahan', description: 'The Big Day!', dueDate: '2025-03-15', milestone: 'D-Day', status: 'pending', clientId: '1' },
];

export const mockPayments: Payment[] = [
  { id: '1', clientId: '1', clientName: 'Sarah & Mark', vendorId: '6', vendorName: 'Grand Ballroom Hotel', amount: 50000000, type: 'dp', status: 'paid', dueDate: '2024-12-01', paidDate: '2024-11-28' },
  { id: '2', clientId: '1', clientName: 'Sarah & Mark', vendorId: '1', vendorName: 'Elegant Catering Co.', amount: 30000000, type: 'dp', status: 'paid', dueDate: '2024-12-15', paidDate: '2024-12-10' },
  { id: '3', clientId: '1', clientName: 'Sarah & Mark', vendorId: '2', vendorName: 'Moments Photography', amount: 15000000, type: 'dp', status: 'pending', dueDate: '2024-12-25' },
  { id: '4', clientId: '1', clientName: 'Sarah & Mark', vendorId: '6', vendorName: 'Grand Ballroom Hotel', amount: 50000000, type: 'installment', status: 'pending', dueDate: '2025-02-01' },
  { id: '5', clientId: '2', clientName: 'Emily & David', vendorId: '6', vendorName: 'Beach Resort Villa', amount: 75000000, type: 'dp', status: 'paid', dueDate: '2024-12-20', paidDate: '2024-12-18' },
  { id: '6', clientId: '3', clientName: 'Jessica & Ryan', vendorId: '3', vendorName: 'Bloom & Petals Decoration', amount: 20000000, type: 'dp', status: 'overdue', dueDate: '2024-12-10' },
  { id: '7', clientId: '5', clientName: 'Lisa & Kevin', vendorId: '1', vendorName: 'Elegant Catering Co.', amount: 45000000, type: 'full', status: 'paid', dueDate: '2024-12-20', paidDate: '2024-12-15' },
];

export const dashboardStats = {
  totalClients: mockClients.length,
  totalVendors: mockVendors.length,
  eventsThisMonth: 2,
  totalRevenue: 850000000,
  pendingPayments: mockPayments.filter(p => p.status === 'pending').length,
  overduePayments: mockPayments.filter(p => p.status === 'overdue').length,
};

export const testimonials = [
  {
    id: '1',
    name: 'Sarah & Mark',
    quote: 'WedPlan made our wedding planning journey so smooth and stress-free. The timeline feature kept us on track!',
    image: '/placeholder.svg',
    rating: 5,
  },
  {
    id: '2',
    name: 'Emily & David',
    quote: 'The vendor management system is incredible. We found all our perfect vendors through WedPlan recommendations.',
    image: '/placeholder.svg',
    rating: 5,
  },
  {
    id: '3',
    name: 'Jessica & Ryan',
    quote: 'Budget tracking helped us stay within our limits while still having our dream wedding. Highly recommended!',
    image: '/placeholder.svg',
    rating: 5,
  },
];

export const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: ['Basic Timeline', 'Up to 3 Vendors', 'Email Support', 'Basic Reports'],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299000,
    description: 'Best for small wedding planners',
    features: ['Advanced Timeline', 'Unlimited Vendors', 'Priority Support', 'Financial Reports', 'Client Portal', 'Custom Branding'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 499000,
    description: 'For professional organizers',
    features: ['Everything in Pro', 'Multiple Events', 'Team Collaboration', 'API Access', 'White Label', 'Dedicated Account Manager'],
    popular: false,
  },
];
