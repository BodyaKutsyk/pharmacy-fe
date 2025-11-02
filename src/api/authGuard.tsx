import { PropsWithChildren } from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth.ts';

export const AuthGuard = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
