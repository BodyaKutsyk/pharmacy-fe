export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  pharmacistId: string;
}

export type CustomerMutation = Partial<
  Pick<Customer, 'birthDate' | 'lastName' | 'firstName' | 'phone'>
>;
