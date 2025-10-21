import React from 'react'
import { login } from '../lib/api'
import { useMutation, useQueryClient  } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

     const {mutate, isPending, error} =useMutation({
    mutationFn: login,
    onSuccess: () => {
      console.log("Login successful, updating auth state");
      queryClient.invalidateQueries({queryKey: ["authUser"]});
      // Navigate to home page after successful login
      navigate('/');
    },
    onError: (error) => {
      console.error("Login failed:", error);
    }
  })

  return {error, isPending, loginMutation: mutate};
}

export default useLogin
