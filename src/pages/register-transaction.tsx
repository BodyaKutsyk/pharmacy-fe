import { useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PaidIcon from '@mui/icons-material/Paid';
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  Stack,
  styled,
  TextFieldProps,
  Typography,
} from '@mui/material';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { SearchIcon } from 'lucide-react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { toast } from 'react-hot-toast';
import PhoneInput from 'react-phone-input-material-ui';
import validator from 'validator';
import { z } from 'zod';

import BackButton from '@/components/common/BackButton';
import Button from '@/components/common/button';
import { ErrorMessage } from '@/components/common/errorMessage';
import IconWrapper from '@/components/common/icon-wrapper';
import { useGetAllMedicines } from '@/features/medicine/hooks/useMedicine.ts';
import { useAddTransaction } from '@/features/transaction/hooks/useTransactions.ts';

const medicineSchema = z.object({
  medicineId: z.coerce
    .number({
      required_error: 'Please select a medicine.',
      invalid_type_error: 'Please select a medicine.',
    })
    .min(1)
    .nullable()
    .refine((v) => v !== null, { message: 'Medicine is required' }),
  quantity: z.coerce
    .number()
    .min(1)
    .nullable()
    .refine((v) => v !== null, { message: 'Quantity is required' }),
});

const phoneValidator = z
  .string()
  .refine((v) => validator.isMobilePhone(v, 'uk-UA'), {
    message: 'Invalid phone number format for Ukraine.',
  });

const FormContainer = styled('form')(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  alignItems: 'center',
  transition: 'all 0.3s ease-in-out',
}));

const TextFieldWrapper = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'height 0.3s ease-in-out',
  gap: 4,
}));

const RegisterTransaction = () => {
  const { data: medicines, isLoading } = useGetAllMedicines();
  const { mutate, isLoading: transactionLoading } = useAddTransaction();

  const [filteredMedicines, setFilteredMedicines] = useState(medicines);
  const [isPhone, setIsPhone] = useState(false);
  const maxMedicines = medicines?.length ?? 1;

  const schema = z.object({
    phone: isPhone ? phoneValidator : z.string().optional().or(z.literal('')),
    medicines: z
      .array(medicineSchema)
      .min(1, 'Please add at least one medicine')
      .max(maxMedicines),
  });

  type FormSchema = z.infer<typeof schema>;

  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: {
      phone: isPhone ? '3800000000000' : '',
      medicines: [{}],
    },
    resolver: zodResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medicines',
  });

  const watchedMedicines = useWatch({
    control,
    name: 'medicines',
  });

  const totalAmount = useMemo(() => {
    if (!watchedMedicines.length) return 0;

    const rawTotal = watchedMedicines.reduce((prev, current) => {
      const medicine = medicines?.find((m) => m.id === current.medicineId);

      return medicine ? prev + medicine.price * current.quantity : prev;
    }, 0);

    return Math.floor(rawTotal * 100) / 100;
  }, [medicines, watchedMedicines]);

  const PhoneTextField = (props: TextFieldProps) => {
    return <TextField error={!!errors.phone} {...props} />;
  };

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    const hasSomeError = data.medicines.some((field, i) => {
      const medicine = medicines?.find(
        (medicine) => medicine.id === field.medicineId,
      );

      if (medicine && medicine.quantity < field.quantity) {
        setError(`medicines.${i}.quantity`, {
          message:
            'Maximum quantity is bigger than expected: ' + medicine.quantity,
        });
        return true;
      }

      return false;
    });

    if (hasSomeError) {
      return;
    }

    const medicinesData = data.medicines?.map((medicine) => {
      const unitPrice =
        medicines?.find(
          (currentMedicine) => currentMedicine.id === medicine.medicineId,
        )?.price || 0;

      return {
        ...medicine,
        unitPrice,
      };
    });

    mutate(
      {
        phone: data?.phone ? data.phone : null,
        medicines: medicinesData,
        totalValue: totalAmount.toString(),
      },
      {
        onSuccess: () => {
          toast.success('Transaction was registered successfully!');
          reset();
        },
        onError: () => {
          toast.error('Failed to create transaction. Please try again');
        },
      },
    );
  };

  if (isLoading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 4, display: 'flex', flex: 1, justifyContent: 'center' }}
      >
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (!medicines || medicines.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error" align="center">
          No medicines available to register a transaction.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <BackButton />
      <Stack
        direction="column"
        justifyContent="space-between"
        gap={6}
        sx={{ mb: 3 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <IconWrapper>
            <PaidIcon />
          </IconWrapper>
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Initialize transaction
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please fill all the provided fields below
            </Typography>
          </Box>
        </Box>
        <Paper
          elevation={0}
          sx={{ p: 4, overflowY: 'scroll', maxHeight: '60vh' }}
        >
          <FormContainer onSubmit={handleSubmit(onSubmit)}>
            <TextFieldWrapper
              sx={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <InputLabel htmlFor="showPhome" sx={{ fontSize: 20 }}>
                Show phone
              </InputLabel>
              <Switch
                value={isPhone}
                onClick={() => setIsPhone((prev) => !prev)}
                id="showPhome"
              />
            </TextFieldWrapper>
            <Divider sx={{ width: '100%' }} />
            {isPhone && (
              <TextFieldWrapper>
                <InputLabel htmlFor="phone">Customer phone</InputLabel>
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
              </TextFieldWrapper>
            )}

            <Box
              sx={{
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {fields.map((field, i) => (
                <Box
                  key={field.id}
                  id={field.id}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 2,
                  }}
                >
                  <TextFieldWrapper sx={{ maxWidth: '50%' }}>
                    <InputLabel htmlFor={`medicine-${i}`}>Medicine</InputLabel>
                    <Controller
                      name={`medicines.${i}.medicineId`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          id={`medicine-${i}`}
                          {...field}
                          value={field.value || ''}
                          error={!!errors.medicines?.[i]?.medicineId}
                        >
                          <ListSubheader>
                            <TextField
                              size="small"
                              autoFocus
                              placeholder="Please select a medicine..."
                              fullWidth
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon />
                                  </InputAdornment>
                                ),
                              }}
                              onChange={(e) => {
                                e.stopPropagation();
                                const medicinesFiltered = [...medicines].filter(
                                  (m) => m.name.includes(e.target.value),
                                );
                                setFilteredMedicines(medicinesFiltered);
                              }}
                              onKeyDown={(e) => {
                                if (e.key !== 'Escape') {
                                  e.stopPropagation();
                                }
                              }}
                            />
                          </ListSubheader>
                          {filteredMedicines?.length ? (
                            filteredMedicines.map((medicine) => {
                              const selectedMedicines = fields.map(
                                (innerField) => innerField.medicineId,
                              );
                              return (
                                <MenuItem
                                  disabled={selectedMedicines.includes(
                                    medicine.id,
                                  )}
                                  key={medicine.id}
                                  value={medicine.id}
                                >
                                  {`${medicine.name}, ${medicine.price} UAH, ${medicine.country}`}
                                </MenuItem>
                              );
                            })
                          ) : (
                            <MenuItem disabled>No medicines available</MenuItem>
                          )}
                        </Select>
                      )}
                    />
                    {errors.medicines?.[i]?.medicineId && (
                      <ErrorMessage>
                        {errors.medicines[i].medicineId.message}
                      </ErrorMessage>
                    )}
                  </TextFieldWrapper>
                  <TextFieldWrapper>
                    <InputLabel htmlFor={`quantity-${i}`}>Quantity</InputLabel>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        gap: 3,
                      }}
                    >
                      <Controller
                        name={`medicines.${i}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            id={`quantity-${i}`}
                            placeholder="2"
                            value={field.value || ''}
                            type="number"
                            error={!!errors.medicines?.[i]?.quantity}
                            helperText={
                              errors.medicines?.[i]?.quantity?.message
                            }
                          />
                        )}
                      />
                      <Button
                        startIcon={<DeleteIcon />}
                        variant="contained"
                        color="error"
                        disabled={fields.length <= 1}
                        onClick={() => remove(i)}
                        sx={{
                          opacity: i > 0 ? 1 : 0,
                          height: '32px',
                          width: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '100%',
                          justifySelf: 'center',
                          '& .MuiButton-icon': {
                            margin: 0,
                          },
                        }}
                      />
                    </Box>
                  </TextFieldWrapper>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                disabled={fields.length >= maxMedicines}
                onClick={() =>
                  fields.length < maxMedicines &&
                  // @ts-expect-error next-line
                  append({ medicineId: null, quantity: null })
                }
                sx={{
                  width: '32px',
                  paddingInline: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '100%',
                  '& .MuiButton-icon': {
                    margin: 0,
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 4,
              }}
            >
              {totalAmount > 0 && (
                <Typography sx={{ fontSize: 24 }}>
                  Total: {totalAmount} UAH
                </Typography>
              )}
              <Button
                fullWidth
                sx={{ paddingBlock: 1 }}
                type="submit"
                variant="outlined"
                loading={transactionLoading}
              >
                Pay
              </Button>
            </Box>
          </FormContainer>
        </Paper>
      </Stack>
    </Container>
  );
};

export default RegisterTransaction;
