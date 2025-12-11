import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'admin' | 'client' | 'vendor'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Login Berhasil!',
        description: `Selamat datang kembali sebagai ${role}.`,
      });
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            <span className="font-display text-2xl font-semibold text-foreground">WedPlan</span>
          </Link>

          {/* Header */}
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Selamat Datang Kembali
          </h1>
          <p className="text-muted-foreground mb-8">
            Masuk ke akun Anda untuk melanjutkan
          </p>

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Login sebagai</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['admin', 'client', 'vendor'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    role === r
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Ingat saya</span>
              </label>
              <a href="#" className="text-sm text-accent hover:underline">
                Lupa password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-rose-gold-dark text-accent-foreground shadow-button"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-muted-foreground mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="text-accent hover:underline font-medium">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-hero items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-pink-soft rounded-full blur-3xl opacity-60 animate-float" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-cream-medium rounded-full blur-3xl opacity-50" />
        </div>
        <div className="relative z-10 text-center p-12">
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            Kelola Pernikahan<br />dengan Mudah
          </h2>
          <p className="text-muted-foreground max-w-md">
            Platform lengkap untuk wedding organizer profesional. Dari timeline hingga pembayaran, semua dalam satu tempat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
