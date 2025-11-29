export interface Pharmacist {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface PharmacistResponse extends Pharmacist {
  createdAt: Date;
  id: number;
  isAdmin?: boolean;
}

export interface AdminResponse {
  id: number;
  pharmacistId: number;
}
