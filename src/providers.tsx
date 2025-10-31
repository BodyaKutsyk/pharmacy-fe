import { PropsWithChildren } from 'react';

import { StyledEngineProvider } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { ToasterConfig } from '@/components';
import QueryProvider from '@/provider/query-provider.tsx';
import LayoutConfigProvider from '@/provider/theme-config-provider.tsx';

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledEngineProvider injectFirst>
        <LayoutConfigProvider>
          <QueryProvider>
            <ToasterConfig />
            {children}
          </QueryProvider>
        </LayoutConfigProvider>
      </StyledEngineProvider>
    </LocalizationProvider>
  );
};
