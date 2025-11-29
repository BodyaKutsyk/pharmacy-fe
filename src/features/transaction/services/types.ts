export interface TransactionMedicine {
  quantity: number;
  medicineId: number;
  unitPrice: number;
}

export interface TransactionMedicineRequest {
  medicines: TransactionMedicine[];
  transactionId: string;
}

export interface Transaction {
  phone: string | null;
  totalValue?: string;
}

export interface TransactionResponse extends Transaction {
  createdAt: Date;
}

export interface TransactionMutation extends Transaction {
  medicines: TransactionMedicine[];
}
