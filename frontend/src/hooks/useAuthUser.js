import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/api';

const useAuthUsers = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (unauthorized)
      if (error?.response?.status === 401) {
        return false;
      }
      // Retry once on other errors
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return {
    isLoading: authUser.isLoading,
    authUser: authUser.data,
    isError: authUser.isError,
    error: authUser.error
  }
}

export default useAuthUsers
