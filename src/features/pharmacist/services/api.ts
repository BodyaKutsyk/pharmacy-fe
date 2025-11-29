import axiosClient from '@/api/axios-client.ts';
import {
  AdminResponse,
  Pharmacist,
  PharmacistResponse,
} from '@/features/pharmacist/services/types.ts';

const BASE_URL = '/pharmacist';
const ADMIN_URL = '/admins';

const pharmacistsApi = {
  getAll: async () =>
    await axiosClient
      .get<
        void,
        { pharmacist: PharmacistResponse; admin: AdminResponse }[]
      >(BASE_URL + ADMIN_URL)
      .then((res) =>
        res.map((data) => {
          if (data.admin) {
            data.pharmacist.isAdmin = true;
          }

          return data.pharmacist;
        }),
      ),
  create: async (pharmacist: Pharmacist) =>
    await axiosClient.post<Pharmacist, PharmacistResponse>(
      BASE_URL,
      pharmacist,
    ),
  update: async (pharmacist: PharmacistResponse) =>
    await axiosClient.patch<PharmacistResponse, PharmacistResponse>(
      `${BASE_URL}/${pharmacist.id}`,
      pharmacist,
    ),
  upgradeToAdmin: async (id: number) =>
    axiosClient.post<{ id: number }>(`${ADMIN_URL}/${id}`),
  downgrade: async (id: number) =>
    await axiosClient.delete<{ id: number }>(`${ADMIN_URL}/${id}`),
  delete: async (id: number) =>
    await axiosClient.delete<{ id: number }>(`${BASE_URL}/${id}`),
};

export default pharmacistsApi;
