import { useMutation, useQuery } from '@tanstack/react-query';

import pharmacistsApi from '@/features/pharmacist/services/api.ts';

export const useGetPharmacists = () =>
  useQuery({
    queryFn: pharmacistsApi.getAll,
    queryKey: ['get-pharmacists'],
  });

export const useAddPharmacist = () =>
  useMutation({
    mutationFn: pharmacistsApi.create,
    mutationKey: ['add-pharmacist'],
  });

export const useUpdatePharmacist = () =>
  useMutation({
    mutationFn: pharmacistsApi.update,
    mutationKey: ['update-pharmacist'],
  });

export const useUpgradeToAdmin = () =>
  useMutation({
    mutationFn: pharmacistsApi.upgradeToAdmin,
    mutationKey: ['upgrade-to-admin-pharmacist'],
  });

export const useDowngradeToPharmacist = () =>
  useMutation({
    mutationFn: pharmacistsApi.downgrade,
    mutationKey: ['downgrade-to-pharmacist'],
  });

export const useDeletePharmacist = () =>
  useMutation({
    mutationFn: pharmacistsApi.delete,
    mutationKey: ['delete-pharmacist'],
  });
