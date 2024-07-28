import { useEffect, useState } from 'react';
import { verifyToken, verifyServer } from '../utils/verify';

export function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkServerAndToken = async () => {
      try {
        await verifyServer(import.meta.env.VITE_SERVIDOR_URL);

        await new Promise(resolve => setTimeout(resolve, 5000));

        const isAuthenticated = await verifyToken();
        setIsLoading(false);

        if (isAuthenticated) {
          window.location.href = '/dash';
        } else {
          window.location.href = '/login';
        }
      } catch (error) {
        window.location.href = '/err/off';
      }
    };

    checkServerAndToken();
  }, []);

  if (isLoading) {
    return <main className="_home"></main>;
  }

  return null;
}
