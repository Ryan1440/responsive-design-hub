import { Outlet } from 'react-router-dom';
import RoleBasedSidebar from '@/components/dashboard/RoleBasedSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

const DashboardLayout = () => {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <RoleBasedSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
