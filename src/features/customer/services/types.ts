export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  pharmacistId: string;
}

export interface CustomerApiError {
  response: {
    data: {
      message: string;
    };
  };
}

export type CustomerMutation = Partial<
  Pick<Customer, 'birthDate' | 'lastName' | 'firstName' | 'phone'>
>;
