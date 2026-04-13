import { Navigate, useLocation } from 'react-router-dom';

const PUBLIC_PATHS = ['/login', '/register'];

function getCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='))
    ?.split('=')[1];
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return <>{children}</>;
  }

  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute