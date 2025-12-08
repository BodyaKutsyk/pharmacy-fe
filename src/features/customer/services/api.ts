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
  getById: (id: number) => axiosClient.get(`${BASE_URL}/${id}`),
  delete: (id: number) => axiosClient.delete(`${BASE_URL}/${id}`),
  update: (customer: Omit<Customer, 'pharmacistId'>) => {
    const { id, ...payload } = customer;
    return axiosClient.patch(`${BASE_URL}/${customer.id}`, payload);
  },
};

export default customerApi;
