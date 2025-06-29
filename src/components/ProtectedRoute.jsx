const { Navigate, useLocation } = require('react-router-dom');
const authService = require('../services/authService.js');

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const isAuthenticated = authService.isAuthenticated();
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;