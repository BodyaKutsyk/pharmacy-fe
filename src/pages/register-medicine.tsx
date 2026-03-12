import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import {
  Box,
  Collapse,
  Container,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import BackButton from '@/components/common/BackButton';
import Button from '@/components/common/button';
import CountrySelect, { countries } from '@/components/common/country-select';
import { DatePicker } from '@/components/common/date-picker';
import IconWrapper from '@/components/common/icon-wrapper';
import { useAddMedicine } from '@/features/medicine/hooks/useMedicine.ts';
import useRecentMedicines from '@/features/medicine/hooks/useRecentMedicines.tsx';

export const medicineDosageUnit = [
  'mg',
  'g',
  'ml',
  'tablet(s)',
  'capsule(s)',
  'patch(es)',
  'puff(s)',
  'drop(s)',
  'unit(s)',
  'spray(s)',
] as const;

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Medicine name is too short' })
    .max(100, { message: 'Medicine name is too large' })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message:
        'First name can only contain letters, spaces, hyphens, and apostrophes',
    }),
  country: z.string().trim(),
  price: z.coerce.number().min(1),
  quantity: z.coerce.number().min(1),
  dosageValue: z.coerce
    .number()
    .min(1)
    .optional()
    .or(
      z
        .string()
        .trim()
        .max(0)
        .transform((v) => +v),
    ),
  dosageUnit: z.enum(medicineDosageUnit).optional(),
  description: z
    .string()
    .trim()
    .min(20)
    .optional()
    .or(z.string().trim().max(0)),
  requiresPrescription: z.boolean().optional(),
  expiryDate: z.date().min(new Date(), { message: 'Today?' }).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const FormContainer = styled('form')(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  transition: 'all 0.3s ease-in-out',
}));

const TextFieldWrapper = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'height 0.3s ease-in-out',
  gap: 4,
}));

const RegisterMedicine = () => {
  const { mutate, isLoading } = useAddMedicine();
  const { handleAddedMedicine } = useRecentMedicines();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    mutate(data, { onSuccess: () => navigate('/') });
    handleAddedMedicine({
      name: data.name,
      id: `${data.name + data.expiryDate}`,
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <IconWrapper>
            <LocalPharmacyIcon />
          </IconWrapper>
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Add new medicine
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please fill all the provided fields below
            </Typography>
          </Box>
        </Box>
        <Paper elevation={0} sx={{ p: 4 }}>
          <FormContainer onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                gap: 2,
              }}
            >
              <TextFieldWrapper>
                <FormLabel htmlFor="name">Medicine name</FormLabel>
                <TextField
                  {...register('name')}
                  id="name"
                  name="name"
                  placeholder="Paracetamol"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </TextFieldWrapper>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                }}
              >
                <TextFieldWrapper sx={{ width: '100%' }}>
                  <FormLabel htmlFor="country-select">Country</FormLabel>
                  <Controller
                    control={control}
                    render={({ field }) => {
                      const selectedCountry =
                        countries.find((c) => c.label === field.value) || null;

                      return (
                        <CountrySelect
                          value={selectedCountry}
                          onChange={(newValue) =>
                            field.onChange(newValue ? newValue.label : '')
                          }
                          error={!!errors.country}
                          helperText={errors.country?.message}
                        />
                      );
                    }}
                    name="country"
                  />
                </TextFieldWrapper>
                <TextFieldWrapper sx={{ width: '100%' }}>
                  <FormLabel htmlFor="price">Price</FormLabel>
                  <TextField
                    id="price"
                    placeholder="54 UAH"
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    {...register('price')}
                  />
                </TextFieldWrapper>
                <TextFieldWrapper sx={{ width: '100%' }}>
                  <FormLabel htmlFor="quantity">Quantity</FormLabel>
                  <TextField
                    id="quantity"
                    placeholder="0"
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                    {...register('quantity')}
                  />
                </TextFieldWrapper>
              </Box>
              <Collapse
                sx={{
                  width: '100%',
                  '& .MuiCollapse-wrapperInner': {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  },
                }}
                in={showOptionalFields}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 2,
                  }}
                >
                  <TextFieldWrapper sx={{ width: '100%' }}>
                    <FormLabel htmlFor="country-select">
                      Expiration date
                    </FormLabel>
                    <DatePicker control={control} name="expiryDate" />
                  </TextFieldWrapper>
                  <TextFieldWrapper sx={{ width: '100%' }}>
                    <FormLabel htmlFor="dosageValue">Dosage</FormLabel>
                    <TextField
                      id="dosageValue"
                      placeholder="100"
                      {...register('dosageValue')}
                      error={!!errors.dosageValue || !!errors.dosageUnit}
                      helperText={
                        errors.dosageValue?.message ||
                        errors.dosageUnit?.message
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Controller
                              name="dosageUnit"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  defaultValue="unit(s)"
                                  variant="standard"
                                  disableUnderline
                                  sx={{ mr: 1.5 }}
                                >
                                  {medicineDosageUnit.map((unit) => (
                                    <MenuItem key={unit} value={unit}>
                                      {unit}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </TextFieldWrapper>
                  <TextFieldWrapper
                    sx={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: '20px',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="requiresPrescription"
                          sx={{ height: '100%' }}
                        />
                      }
                      label="Requires prescription"
                      {...register('requiresPrescription')}
                    />
                  </TextFieldWrapper>
                </Box>
                <TextFieldWrapper>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <TextField
                    id="description"
                    placeholder="Enter description of the medicine"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    {...register('description')}
                  />
                </TextFieldWrapper>
              </Collapse>
              <Button
                startIcon={
                  showOptionalFields ? (
                    <ArrowUpwardIcon />
                  ) : (
                    <ArrowDownwardIcon />
                  )
                }
                variant="contained"
                onClick={() => setShowOptionalFields((prev) => !prev)}
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
            <Button
              loading={isLoading}
              fullWidth
              type="submit"
              variant="outlined"
              sx={{ height: '50px' }}
            >
              Submit
            </Button>
          </FormContainer>
        </Paper>
      </Stack>
    </Container>
  );
};

export default RegisterMedicine;
