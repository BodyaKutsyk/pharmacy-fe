import axiosClient from '@/api/axios-client';
import { Medicine, MedicineMutation } from '@/features/medicine/services/types';

const BASE_URL = '/medicine';

const medicineApi = {
  getAll: async () => axiosClient.get<void, Medicine[]>(BASE_URL),
  getOne: async (id: string) => axiosClient.get<Medicine>(`${BASE_URL}/${id}`),
  create: async (medicine: MedicineMutation) =>
    axiosClient.post<Medicine>(BASE_URL, medicine),
  patch: async (medicine: Omit<Medicine, 'pharmacistId' | 'createdAt'>) => {
    const { id, ...rest } = medicine;
    return await axiosClient.patch<void, Medicine>(`${BASE_URL}/${id}`, rest);
  },
};

export default medicineApi;
