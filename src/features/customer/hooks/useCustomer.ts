import { useMutation, useQuery } from '@tanstack/react-query';

import customerApi from '@/features/customer/services/api.ts';

export const useGetAllCustomers = () => {
  return useQuery({
    queryKey: ['get-customers'],
    queryFn: customerApi.getAll,
  });
};

export const useAddCustomer = () => {
  return useMutation({
    mutationKey: ['add-customer'],
    mutationFn: customerApi.add,
  });
};

export const useDeleteCustomer = () => {
  return useMutation({
    mutationKey: ['delete-customer'],
    mutationFn: customerApi.delete,
  });
};

export const useUpdateCustomer = () => {
  return useMutation({
    mutationKey: ['update-customer'],
    mutationFn: customerApi.update,
  });
};
