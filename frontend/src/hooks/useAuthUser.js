import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/api';

const useAuthUsers = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // Retry once on failure
    });
    return {isLoading: authUser.isLoading, authUser: authUser.data?.user}
}

export default useAuthUsers
