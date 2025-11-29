import { useMutation, useQuery } from '@tanstack/react-query';

import transactionsApi from '@/features/transaction/services/api.ts';
import { TransactionMutation } from '@/features/transaction/services/types.ts';

const createTransaction = async (data: TransactionMutation) => {
  const transactionId = await transactionsApi.initialize({
    totalValue: data.totalValue,
    phone: data?.phone,
  });

  console.log(transactionId);

  if (!transactionId) {
    throw new Error('Failed to create transaction');
  }

  await transactionsApi.addMedicines(transactionId, data.medicines);
};

export const useAddTransaction = () =>
  useMutation({
    mutationFn: createTransaction,
    mutationKey: ['add-transaction'],
  });

export const useGetTransactions = () =>
  useQuery({
    queryKey: ['get-transactions'],
    queryFn: transactionsApi.getAll,
  });
