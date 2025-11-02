import { useContext } from 'react';

import { AuthContext } from '@/provider/auth-provider.tsx';

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
};
