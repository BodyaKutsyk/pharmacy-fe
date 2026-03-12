import axiosClient from '@/api/axios-client.ts';
import {
  Transaction,
  TransactionMedicineRequest,
  TransactionResponse,
} from '@/features/transaction/services/types.ts';

const BASE_URL = '/transaction';
const ADD_MEDICINE = '/transaction-medicine';

const transactionsApi = {
  getAll: async () =>
    await axiosClient.get<TransactionResponse[], TransactionResponse[]>(
      BASE_URL,
    ),
  initialize: async (data: Transaction) =>
    await axiosClient.post(BASE_URL, data),
  addMedicines: async (
    transactionId: string,
    medicines: TransactionMedicineRequest['medicines'],
  ) =>
    await axiosClient.post(ADD_MEDICINE, {
      transactionId,
      medicines: medicines,
    }),
};

export default transactionsApi;
