import { ApiError } from '@/api/api.ts';
import axiosClient from '@/api/axios-client.ts';
import {
  Customer,
  CustomerMutation,
} from '@/features/customer/services/types.ts';

const BASE_URL = '/customer';

const customerApi = {
  add: (customer: CustomerMutation) =>
    axiosClient.post<CustomerMutation, Customer>(BASE_URL, customer),
  getAll: () => axiosClient.get<void, Customer[], ApiError>(BASE_URL),
  getById: (id: string) => axiosClient.get(`${BASE_URL}/${id}`),
  delete: (id: string) => axiosClient.delete(`${BASE_URL}/${id}`),
  update: (id: string, customer: CustomerMutation) =>
    axiosClient.patch(`${BASE_URL}/${id}`, customer),
};

export default customerApi;
