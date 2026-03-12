import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Container,
  Paper,
  Stack,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import dayjs from 'dayjs';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import PhoneInput from 'react-phone-input-material-ui';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import { z } from 'zod';

import BackButton from '@/components/common/BackButton';
import { DatePicker } from '@/components/common/date-picker';
import { ErrorMessage } from '@/components/common/errorMessage';
import { useAddCustomer } from '@/features/customer/hooks/useCustomer';

const FormContainer = styled('form')(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '36px',
}));

const formSchema = z.object({
  firstName: z
    .string()
    .trim()
    .regex(/^[a-zA-Z\s'-]+$/, {
      message:
        'First name can only contain letters, spaces, hyphens, and apostrophes',
    })
    .min(2, { message: 'First name is too short' })
    .max(20, { message: 'First name is too large' }),
  lastName: z
    .string()
    .trim()
    .regex(/^[a-zA-Z\s'-]+$/, {
      message:
        'Last name can only contain letters, spaces, hyphens, and apostrophes',
    })
    .min(2, { message: 'Last name is too short' })
    .max(20, { message: 'Last name is too large' }),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
  phone: z.string().refine((v) => validator.isMobilePhone(v, 'uk-UA')),
  birthDate: z
    .date()
    .min(new Date('1900-01-01'), { message: 'Too old!' })
    .max(new Date(), { message: 'Too young!' }),
});

type FormSchema = z.infer<typeof formSchema>;

const RegisterCustomer = () => {
  const { mutate: addCustomer } = useAddCustomer();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: new Date(),
    },
  });

  const PhoneTextField = (props: TextFieldProps) => {
    return <TextField {...props} error={!!errors.phone} />;
  };

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    const payload = {
      ...data,
      birthDate: dayjs(data.birthDate).format('YYYY-MM-DD'),
    };

    addCustomer(payload, {
      onSuccess: () => {
        navigate('/home');
      },
      onError: (e) => {
        let message = 'Failed to register customer';

        if (axios.isAxiosError(e)) {
          message =
            e.response?.data?.message || e.response?.data?.response || message;
        }

        toast.error(message);
      },
    });
  };
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <BackButton />
      <Stack
        direction="column"
        justifyContent="space-between"
        gap={6}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Add new customer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please fill all the provided fields below
          </Typography>
        </Box>
        <Paper elevation={0} sx={{ p: 4 }}>
          <FormContainer onSubmit={handleSubmit(onSubmit)}>
            <Box flexDirection="column" sx={{ display: 'flex', gap: 2 }}>
              <Stack direction="row" justifyContent="space-between" gap={4}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: '50%',
                  }}
                >
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
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: '50%',
                  }}
                >
                  <FormLabel htmlFor="lastName">Last name</FormLabel>
                  <TextField
                    {...register('lastName')}
                    id="lastName"
                    name="lastName"
                    placeholder="Enter last name"
                    error={!!errors.lastName}
                  />
                  {errors.lastName && (
                    <ErrorMessage>{errors.lastName.message}</ErrorMessage>
                  )}
                </Box>
              </Stack>
              <Stack direction="row" justifyContent="space-between" gap={4}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: '50%',
                  }}
                >
                  <FormLabel htmlFor="firstName">Phone</FormLabel>
                  <Controller
                    control={control}
                    name="phone"
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <PhoneInput
                          onChange={onChange}
                          value={value || ''}
                          component={PhoneTextField}
                          label=""
                          preferredCountries={['ua']}
                          country="ua"
                        />
                        {error?.message && (
                          <ErrorMessage>{error.message}</ErrorMessage>
                        )}
                      </>
                    )}
                    rules={{ required: 'Phone number is required' }}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: '50%',
                  }}
                >
                  <FormLabel htmlFor="lastName">Birthday</FormLabel>
                  <DatePicker
                    control={control}
                    name="birthDate"
                    disablePast={false}
                    disableFuture
                  />
                </Box>
              </Stack>
            </Box>
            <Button fullWidth type="submit" variant="outlined">
              Submit
            </Button>
          </FormContainer>
        </Paper>
      </Stack>
    </Container>
  );
};

export default RegisterCustomer;
