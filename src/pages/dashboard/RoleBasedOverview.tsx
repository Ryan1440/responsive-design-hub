import { useAuth } from '@/hooks/useAuth';
import Overview from './Overview';
import ClientOverview from './client/ClientOverview';
import VendorOverview from './vendor/VendorOverview';
import { Skeleton } from '@/components/ui/skeleton';

const RoleBasedOverview = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
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

  switch (userRole) {
    case 'admin':
      return <Overview />;
    case 'client':
      return <ClientOverview />;
    case 'vendor':
      return <VendorOverview />;
    default:
      return <ClientOverview />; // Default to client view
  }
};

export default RoleBasedOverview;