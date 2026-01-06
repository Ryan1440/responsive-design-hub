import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useVendors } from '@/hooks/useVendors';
import Overview from './Overview';
import ClientOverview from './client/ClientOverview';
import VendorOverview from './vendor/VendorOverview';
import ClientOnboarding from '@/components/onboarding/ClientOnboarding';
import VendorOnboarding from '@/components/onboarding/VendorOnboarding';
import { Skeleton } from '@/components/ui/skeleton';

const RoleBasedOverview = () => {
  const { user, userRole, loading } = useAuth();
  const { clients, isLoading: clientsLoading } = useClients();
  const { vendors, isLoading: vendorsLoading } = useVendors();

  const isLoading = loading || clientsLoading || vendorsLoading;

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Check if client has data
  const hasClientData = clients.some(c => c.user_id === user?.id);
  
  // Check if vendor has data
  const hasVendorData = vendors.some(v => v.user_id === user?.id);

  switch (userRole) {
    case 'admin':
      return <Overview />;
    case 'client':
      // Show onboarding if no client data
      return hasClientData ? <ClientOverview /> : <ClientOnboarding />;
    case 'vendor':
      // Show onboarding if no vendor data
      return hasVendorData ? <VendorOverview /> : <VendorOnboarding />;
    default:
      return hasClientData ? <ClientOverview /> : <ClientOnboarding />;
  }
};

export default RoleBasedOverview;