import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from '../lib/api';

const useSignUp = () => {
    const queryClient = useQueryClient();

    const {error, isPending, mutate} = useMutation({
        mutationFn: signup,
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["authUser"]})
    })
    


  return {error, isPending, signupMutation: mutate};
}

export default useSignUp
