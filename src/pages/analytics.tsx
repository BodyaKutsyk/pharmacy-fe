import { useMemo, useState } from 'react';

import {
  Box,
  Container,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';

import { useGetAllMedicines } from '@/features/medicine/hooks/useMedicine.ts';
import { useGetTransactions } from '@/features/transaction/hooks/useTransactions.ts';
import daysInMonthArray from '@/utils/daysInMonthArray.ts';

interface CountryData {
  value: number;
  label: string;
  id: number;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const date = new Date();
const currentMonth = date.getMonth();

const Card = styled(Box)(({ theme }) => ({
  padding: '8px',
  borderRadius: '16px',
  backgroundColor: theme.palette.background.paper,
}));

const Analytics = () => {
  const { data, isLoading } = useGetAllMedicines();
  const { data: transactions } = useGetTransactions();

  const [activeMonth, setActiveMonth] = useState(currentMonth);

  const days = useMemo(() => daysInMonthArray(activeMonth + 1), [activeMonth]);

  const countries = useMemo(() => {
    const countriesCount: CountryData[] = [];
    data?.map((m) => {
      const index = countriesCount.findIndex((c) => c.label === m.country);
      if (index !== -1) {
        countriesCount[index].value++;
        return;
      }

      countriesCount.push({ id: m.id, label: m.country, value: 0 });
    });

    return countriesCount;
  }, [data]);

  const medicinesThisMonth = useMemo(() => {
    const medicinesData = [...days].fill(0);
    const thisMonth =
      data?.filter((m) => {
        const medicineDate = new Date(m.createdAt);

        return medicineDate.getMonth() === activeMonth;
      }) || [];

    thisMonth.forEach((d) => {
      const date = new Date(d.createdAt);
      medicinesData[date.getDate() - 1] += 1;

      return d;
    });

    return medicinesData;
  }, [activeMonth, data, days]);

  const incomeThisMonth = useMemo(() => {
    const transactionsData = [...days].fill(0);
    const thisMonth =
      transactions?.filter((m) => {
        const medicineDate = new Date(m.createdAt);

        return medicineDate.getMonth() === activeMonth;
      }) || [];

    thisMonth.forEach((d) => {
      const date = new Date(d.createdAt);
      transactionsData[date.getDate() - 1] += Number(d.totalValue || 0);

      return d;
    });

    return transactionsData;
  }, [activeMonth, days, transactions]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        // py: 6,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        textAlign: 'flex-start',
        gap: 8,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Analytics</Typography>
        <Select
          sx={{
            borderRadius: '8px',
          }}
          variant="outlined"
          disableUnderline
          value={activeMonth}
          onChange={(e) => setActiveMonth(+e.target.value)}
        >
          {months.slice(0, currentMonth + 1).map((month, i) => (
            <MenuItem key={month} value={i}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Stack
        direction="column"
        alignItems="center"
        sx={{ mb: 3, height: '100%', gap: 1 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            gap: 1,
          }}
        >
          <Card
            sx={{
              width: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h6">Medicine registration</Typography>
            <BarChart
              loading={isLoading}
              height={300}
              width={600}
              series={[
                {
                  color: '#2E7D32',
                  data: medicinesThisMonth,
                  label: 'Registration each day',
                  valueFormatter: (t, { dataIndex }) =>
                    t === null
                      ? ''
                      : `${dataIndex + 1}, ${months[activeMonth]}`,
                },
              ]}
              yAxis={[{ label: 'Transactions' }]}
              xAxis={[{ data: days, label: 'Days' }]}
            />
          </Card>

          <Card
            sx={{
              width: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h6">Medicines origin</Typography>
            <PieChart
              series={[
                {
                  data: countries,
                },
              ]}
              width={200}
              height={200}
            />
          </Card>
        </Box>
        <Card
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            gap: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6">Income in {months[activeMonth]}</Typography>
          <LineChart
            colors={['#2E7D32']}
            xAxis={[{ data: days }]}
            series={[
              {
                label: 'Income, UAH',
                data: incomeThisMonth,
                showMark: false,
              },
            ]}
            height={300}
            width={1000}
          />
        </Card>
      </Stack>
    </Container>
  );
};

export default Analytics;
