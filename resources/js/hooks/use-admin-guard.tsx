import { useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { type SharedData } from '@/types';

export function useAdminGuard() {
  const page = usePage<SharedData>();
  const { auth } = page.props;

  useEffect(() => {
    if (!auth?.user) {
      router.visit('/login');
      return;
    }

    if (auth.user.role !== 'admin') {
      router.visit('/dashboard', {
        onError: (errors) => {
          console.error('Access denied:', errors);
        },
      });
    }
  }, [auth]);

  return {
    isAdmin: auth?.user?.role === 'admin',
    user: auth?.user,
  };
} 