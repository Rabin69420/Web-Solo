import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated()) {
    if (isAdmin()) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/overview" replace />;
    }
  }

  return children;
};

export default PublicRoute;