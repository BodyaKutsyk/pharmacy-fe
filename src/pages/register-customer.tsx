import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import PhoneInput from 'react-phone-input-material-ui';

import { DatePicker } from '@/components/common/date-picker';

/*
  phone: varchar('phone', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  birthDate: date({ mode: 'date' }).notNull(),
* */

const RegisterCustomer = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          <FormControl sx={{ gap: 4 }} fullWidth defaultValue="">
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
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
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
                <FormLabel htmlFor="lastName">Last name</FormLabel>
                <TextField
                  required
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                />
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
                <PhoneInput
                  component={TextField}
                  label=""
                  country="ua"
                  onChange={() => {}}
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
                <DatePicker />
              </Box>
            </Stack>
            <Button fullWidth type="submit" variant="outlined">
              Submit
            </Button>
          </FormControl>
        </Paper>
      </Stack>
    </Container>
  );
};

export default RegisterCustomer;
