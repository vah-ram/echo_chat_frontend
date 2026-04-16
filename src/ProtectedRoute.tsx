import { Navigate, useLocation } from 'react-router-dom';

const PUBLIC_PATHS = ['/login', '/register'];

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute