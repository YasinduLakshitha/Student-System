import { useState, useCallback } from 'react';
import API from '../api/client';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async (method: 'get' | 'post' | 'put' | 'delete' | 'patch', url: string, data?: any) => {
      setLoading(true);
      setError(null);
      try {
        const response = await API[method](url, data);
        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Something went wrong';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { request, loading, error };
};
