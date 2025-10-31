import { ReactElement, useCallback, useEffect, useMemo } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { darkTheme, lightTheme } from '@/app/styles/theme.ts';
import { useThemeStore } from '@/hooks';

type Props = {
  children: ReactElement;
};

function LayoutConfigProvider({ children }: Props) {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const setThemeState = useCallback(
    (dark = true) => {
      setTheme({
        theme: dark ? 'dark' : 'light',
      });
    },
    [setTheme],
  );

  const matchMode = useCallback(
    (e: MediaQueryListEvent) => {
      setThemeState(e.matches);
    },
    [setThemeState],
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');
    setThemeState(theme === 'dark');

    if (!localStorage.getItem('theme')) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');

      mql.addEventListener('change', matchMode);
    }

    root.classList.add(theme);
  }, [matchMode, setThemeState, theme]);

  const muiTheme = useMemo(
    () => (theme === 'dark' ? darkTheme : lightTheme),
    [theme],
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default LayoutConfigProvider;
