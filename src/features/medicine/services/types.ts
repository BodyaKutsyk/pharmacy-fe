export interface MedicineMutation {
  name: string;
  country: string;
  price: number;
  quantity: number;
  expiryDate?: Date;
  requiresPrescription?: boolean;
  dosageValue?: number;
  dosageUnit?: string;
  description?: string;
}

export interface Medicine extends MedicineMutation {
  id: number;
  pharmacistId: string;
  createdAt: string;
}
