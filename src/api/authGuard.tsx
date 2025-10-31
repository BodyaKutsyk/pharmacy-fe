import { PropsWithChildren } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth.ts';

export const AuthGuard = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
  }

  return <>{children}</>;
};
