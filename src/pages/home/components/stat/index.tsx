import { ReactNode } from 'react';

import { Box, CircularProgress, Typography } from '@mui/material';

export const Stat = ({
  label,
  value,
  isLoading,
}: {
  isLoading?: boolean;
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
    {isLoading ? (
      <CircularProgress />
    ) : (
      <>
        {typeof value === 'string' ? (
          <Typography variant="h6" fontWeight={800}>
            {value}
          </Typography>
        ) : (
          value
        )}
      </>
    )}

    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Box>
);
