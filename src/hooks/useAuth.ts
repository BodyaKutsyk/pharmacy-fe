import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      setAccessToken(accessToken);
    }
  }, []);

  return { isAuthenticated: !!accessToken };
};
