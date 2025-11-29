import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Container,
  Dialog,
  DialogTitle,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FaCircleDown, FaCircleUp, FaTrash } from 'react-icons/fa6';
import { z } from 'zod';

import Button from '@/components/common/button';
import { ErrorMessage } from '@/components/common/errorMessage';
import TextFieldWrapper from '@/components/common/textFieldWrapper';
import {
  useAddPharmacist,
  useDeletePharmacist,
  useDowngradeToPharmacist,
  useGetPharmacists,
  useUpgradeToAdmin,
} from '@/features/pharmacist/hooks/usePharmacists';
import { PharmacistResponse } from '@/features/pharmacist/services/types';

const FormContainer = styled('form')(() => ({
  padding: 16,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
}));

const schema = z.object({
  firstName: z.string().trim().min(2).max(30),
  lastName: z.string().trim().min(2).max(30),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().trim().min(6).max(30),
});

type FormSchema = z.infer<typeof schema>;

const Pharmacists = () => {
  const { data, isLoading } = useGetPharmacists();
  const { mutateAsync: addPharmacist, isLoading: pharmacistLoading } =
    useAddPharmacist();
  const {
    mutateAsync: deletePharmacist,
    isLoading: pharmacistDeletingLoading,
  } = useDeletePharmacist();
  const { mutateAsync: upgradeToAdmin } = useUpgradeToAdmin();
  const { mutateAsync: downgradeToPharmacist } = useDowngradeToPharmacist();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const [pharmacists, setPharmacists] = useState<PharmacistResponse[]>(
    data || [],
  );
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteRow = async (id: number) => {
    await deletePharmacist(id, {
      onSuccess: () => {
        toast.success('Pharmacist deleted successfully.');
        setPharmacists((prev) =>
          prev.filter((pharmacist) => pharmacist.id !== id),
        );
      },
      onError: () => {
        toast.error('Error while deleting pharmacist.');
      },
    });
  };

  const handleUpgradePharmacist = async (id: number) => {
    await upgradeToAdmin(id, {
      onSuccess: () => {
        toast.success('Pharmacist was upgraded to admin successfully.');
        setPharmacists((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isAdmin: true } : p)),
        );
      },
      onError: () => {
        toast.error('Error while upgrade pharmacist.');
      },
    });
  };

  const handleDowngradePharmacist = async (id: number) => {
    await downgradeToPharmacist(id, {
      onSuccess: () => {
        toast.success('Admin was downgraded to pharmacist successfully.');
        setPharmacists((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isAdmin: false } : p)),
        );
      },
      onError: (e) => {
        if (e instanceof AxiosError) {
          toast.error(e.response?.data.message);
        } else {
          toast.error('Error while downgrading admin');
        }
      },
    });
  };

  const rows: Omit<PharmacistResponse, 'createdAt' | 'password'>[] =
    pharmacists.map(({ firstName, lastName, email, id }) => {
      return { firstName, lastName, email, id };
    }) || [];

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
      field: 'email',
      headerName: 'Email',
      editable: true,
      flex: 1,
    },
    {
      field: 'delete',
      headerName: '',
      type: 'actions',
      getActions: ({ id }) => {
        const isAdmin = pharmacists.find(
          (pharmacist) => pharmacist.id === id,
        )?.isAdmin;
        return [
          <GridActionsCellItem
            icon={isAdmin ? <FaCircleDown /> : <FaCircleUp />}
            label="Upgrade"
            onClick={() =>
              isAdmin
                ? handleDowngradePharmacist(+id)
                : handleUpgradePharmacist(+id)
            }
            showInMenu={false}
            disabled={pharmacists.length <= 1}
          />,
          <GridActionsCellItem
            icon={<FaTrash color="#f50057" />}
            label="Delete"
            onClick={() => handleDeleteRow(+id)}
            showInMenu={false}
            disabled={pharmacists.length <= 1}
          />,
        ];
      },
    },
  ];

  const onSubmit = async (values: FormSchema) => {
    await addPharmacist(values, {
      onSuccess: (pharmacist) => {
        toast.success('Pharmacist added successfully.');
        setPharmacists((prev) => [
          ...prev,
          { ...pharmacist, id: pharmacists.length + 1 },
        ]);

        handleResetPharmacist();
      },
      onError: () => {
        toast.error('Failed to add pharmacist.');
      },
    });
  };

  const handleResetPharmacist = () => {
    reset();
    setOpenDialog(false);
  };

  useEffect(() => {
    if (!isLoading && data?.length) {
      setPharmacists(data);
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
        <Typography variant="h3">Pharmacists</Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add pharmacist
        </Button>
      </Box>
      <DataGrid
        showToolbar
        // processRowUpdate={handleRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
        loading={isLoading || pharmacistDeletingLoading}
        sx={{ width: '100%' }}
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
      />

      <Dialog
        open={openDialog}
        onClose={handleResetPharmacist}
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 500 } }}
      >
        <DialogTitle>Add pharmacist</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleResetPharmacist}
          sx={() => ({
            position: 'absolute',
            right: 8,
            top: 8,
          })}
        >
          <CloseIcon />
        </IconButton>
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <TextFieldWrapper>
              <FormLabel htmlFor="firstName">First name</FormLabel>
              <TextField
                {...register('firstName')}
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                error={!!errors.firstName}
              />

              {errors.firstName && (
                <ErrorMessage>{errors.firstName.message}</ErrorMessage>
              )}
            </TextFieldWrapper>
            <TextFieldWrapper>
              <FormLabel htmlFor="lastName">Last name</FormLabel>
              <TextField
                {...register('lastName')}
                id="lastName"
                name="lastName"
                placeholder="Enter first name"
                error={!!errors.firstName}
              />

              {errors.lastName && (
                <ErrorMessage>{errors.lastName.message}</ErrorMessage>
              )}
            </TextFieldWrapper>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextFieldWrapper sx={{ width: '100%' }}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                {...register('email')}
                id="email"
                name="email"
                placeholder="your.email@gmail.com"
                error={!!errors.email}
              />
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
            </TextFieldWrapper>
            <TextFieldWrapper sx={{ width: '100%' }}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                {...register('password')}
                id="password"
                name="password"
                placeholder="****"
                error={!!errors.email}
                inputProps={{
                  type: 'password',
                  autoComplete: 'new-password',
                }}
              />
              {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
              )}
            </TextFieldWrapper>
          </Box>
          <Button loading={pharmacistLoading} variant="outlined" type="submit">
            Submit
          </Button>
        </FormContainer>
      </Dialog>
    </Container>
  );
};

export default Pharmacists;
