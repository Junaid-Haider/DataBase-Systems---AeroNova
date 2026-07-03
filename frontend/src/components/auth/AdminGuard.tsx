import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/stores/authStore';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Strictly enforce ADMIN role
  if (user?.employeeProfile?.Role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
