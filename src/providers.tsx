import { PropsWithChildren } from 'react';

import { StyledEngineProvider } from '@mui/material';

import { ToasterConfig } from '@/components';
import QueryProvider from '@/provider/query-provider.tsx';
import LayoutConfigProvider from '@/provider/theme-config-provider.tsx';

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <StyledEngineProvider injectFirst>
      <LayoutConfigProvider>
        <QueryProvider>
          <ToasterConfig />
          {children}
        </QueryProvider>
      </LayoutConfigProvider>
    </StyledEngineProvider>
  );
};
