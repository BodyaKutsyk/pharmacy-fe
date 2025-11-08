import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import medicineApi from '@/features/medicine/services/api.ts';
import {
  Medicine,
  MedicineMutation,
} from '@/features/medicine/services/types.ts';

export const useGetAllMedicines = () => {
  return useQuery({
    queryKey: ['medicines'],
    queryFn: medicineApi.getAll,
  });
};

export const useAddMedicine = () => {
  return useMutation({
    mutationKey: ['add-medicine'],
    mutationFn: (medicine: MedicineMutation) => medicineApi.create(medicine),
  });
};

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-medicine'],
    mutationFn: (medicine: Omit<Medicine, 'pharmacistId' | 'createdAt'>) =>
      medicineApi.patch(medicine),
    onSuccess: (updatedMedicine: Medicine) => {
      queryClient.setQueryData<Medicine[]>(['medicines'], (oldMedicines) => {
        if (!oldMedicines) return [];

        return oldMedicines.map((medicine) =>
          medicine.id === updatedMedicine.id ? updatedMedicine : medicine,
        );
      });
    },
  });
};
