import { useEffect, useState } from 'react';

import { Box, Container, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { toast } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa6';

import {
  useDeleteCustomer,
  useGetAllCustomers,
  useUpdateCustomer,
} from '@/features/customer/hooks/useCustomer.ts';
import { Customer } from '@/features/customer/services/types.ts';

const Customers = () => {
  const { data, isLoading } = useGetAllCustomers();

  const { mutateAsync: deleteCustomer, isLoading: customerDeletingLoading } =
    useDeleteCustomer();
  const { mutateAsync: updateCustomer } = useUpdateCustomer();

  const [customers, setCustomers] = useState<Customer[]>(data || []);

  const handleDeleteRow = async (id: number) => {
    await deleteCustomer(id, {
      onSuccess: () => {
        toast.success('Customer deleted successfully.');
        setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      },
      onError: () => {
        toast.error('Error while deleting customer.');
      },
    });
  };

  const rows: Omit<Customer, 'pharmacistId'>[] =
    customers.map(
      ({ firstName, lastName, birthDate, phone, id, pharmacistId }) => {
        return { firstName, lastName, birthDate, phone, id, pharmacistId };
      },
    ) || [];

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Id',
      editable: true,
      flex: 1,
    },
    {
      field: 'firstName',
      headerName: 'First name',
      editable: true,
      flex: 1,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      editable: true,
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      editable: true,
      flex: 1,
      valueFormatter: (value) =>
        parsePhoneNumberFromString(value, 'UA')?.formatInternational(),
    },
    {
      field: 'delete',
      headerName: '',
      type: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<FaTrash color="#f50057" />}
            label="Delete"
            onClick={() => handleDeleteRow(+id)}
            showInMenu={false}
            disabled={customers.length <= 1}
          />,
        ];
      },
    },
  ];

  const handleRowUpdate = async (newRow: Omit<Customer, 'pharmacistId'>) => {
    const oldRow = customers?.find((c) => c.id === newRow.id);
    if (!oldRow) return Promise.reject();

    await updateCustomer(
      { ...newRow, phone: `+${newRow.phone}` },
      {
        onSuccess: () => {
          toast.success('Successfully updated customer');
        },
        onError: () => {
          toast.error('Error updating customer');
        },
      },
    );

    setCustomers((prev) =>
      prev.map((c) => (c.id === newRow.id ? { ...c, ...newRow } : c)),
    );

    return newRow;
  };

  useEffect(() => {
    if (!isLoading && data?.length) {
      setCustomers(data);
    }
  }, [data, isLoading]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        textAlign: 'flex-start',
        gap: 4,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Customers</Typography>
      </Box>
      <DataGrid
        showToolbar
        processRowUpdate={handleRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
        loading={isLoading || customerDeletingLoading}
        sx={{ width: '100%' }}
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
      />
    </Container>
  );
};

export default Customers;
