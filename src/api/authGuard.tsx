import { PropsWithChildren } from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth.ts';

interface AuthGuardProps extends PropsWithChildren {
  admin?: boolean;
}

export const AuthGuard = ({ children, admin }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || (!isAdmin && admin)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
