import { useQuery } from '@tanstack/react-query';
import { api } from '../api/axiosConfig';

export function useProductosRealtime() {
  return useQuery({
    queryKey: ['productos'],
    queryFn: async () => {
      const res = await api.get('/productos/get/');
      return res.data;
    },
    refetchInterval: 2000, // cada 2 segundos
    refetchOnWindowFocus: true,
  });
}
