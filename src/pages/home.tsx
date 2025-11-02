import { ReactNode } from 'react';

import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import PaidIcon from '@mui/icons-material/Paid';
import PersonIcon from '@mui/icons-material/Person';
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Stack,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ActionCard } from '@/components/common/action-card';
import { useGetAllCustomers } from '@/features/customer/hooks/useCustomer.ts';
import { capitalizeFirstLetter } from '@/utils';
import { dayOfTime } from '@/utils/dayOfTime.ts';

const partOfDay = dayOfTime();

const Stat = ({
  label,
  value,
}: {
  label: string;
  value: string | ReactNode;
}) => (
  <Box
    sx={{
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      px: 2,
    }}
  >
    {typeof value === 'string' ? (
      <Typography variant="h6" fontWeight={800}>
        {value}
      </Typography>
    ) : (
      value
    )}
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

const Home = () => {
  const navigate = useNavigate();
  const { data: customers, isLoading: customersLoading } = useGetAllCustomers();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Pharmacy Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quick actions for daily dispensing & stock.
          </Typography>
        </Box>
        <Chip
          color="primary"
          label={`Shift: ${capitalizeFirstLetter(partOfDay)} `}
        />
      </Stack>

      <Paper variant="outlined" sx={{ mb: 3, p: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          divider={<Divider flexItem orientation="vertical" />}
          spacing={2}
          justifyContent="space-between"
        >
          <Stat label="Items Low Stock" value="7" />
          <Stat label="Pending Prescriptions" value="12" />
          <Stat label="Expiring Soon" value="4" />
          <Stat
            label={customersLoading ? '' : 'Customers already registered'}
            value={
              (customersLoading ? (
                <CircularProgress color="success" />
              ) : (
                customers?.length.toString()
              )) || 'N/A'
            }
          />
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <ActionCard
            title="Register customer"
            subtitle="Add new customer"
            icon={<PersonIcon />}
            onClick={() => navigate('/customer/register')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ActionCard
            title="Add Medicine"
            subtitle="New product entry"
            icon={<Inventory2RoundedIcon />}
            onClick={() => {}}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ActionCard
            title="Stock Audit"
            subtitle="Count & adjust"
            icon={<AssignmentRoundedIcon />}
            onClick={() => {}}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ActionCard
            title="Transactions"
            subtitle="Manage transactions"
            icon={<PaidIcon />}
            onClick={() => {}}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
