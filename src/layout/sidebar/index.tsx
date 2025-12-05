import {
  Drawer,
  MenuItem,
  MenuItemProps,
  MenuList,
  Tooltip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { navList } from '@/data/constant/navs.tsx';
import { useActiveMenu } from '@/hooks';
import { useAuth } from '@/hooks/useAuth.ts';

interface StyledMenuItemProps extends MenuItemProps {
  active?: boolean;
}

const StyledMenuItem = styled(MenuItem)<StyledMenuItemProps>(({ active }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  position: 'relative',
  padding: 0,

  ...(active && {
    '&::after': {
      position: 'absolute',
      bottom: -10,
      content: '""',
      width: '100%',
      height: '2px',
      backgroundColor: '#dcedc8',
    },
  }),
}));

const IconRenderer = ({
  icon: Icon,
  active,
}: {
  icon: any;
  active: boolean;
}) => {
  return <Icon sx={{ fontSize: 38, color: active ? '#dcedc8' : '#e0f7fa' }} />;
};

export const Sidebar = () => {
  const { checkActive } = useActiveMenu();
  const { isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 60,
          top: '63px',
          boxSizing: 'border-box',
          position: 'fixed',
          height: '100vh',
        },
      }}
    >
      <MenuList
        sx={{
          flex: 1,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '48px',
        }}
      >
        {navList
          .filter((item) => item.icon)
          .map((item) => {
            if (item.isAdmin && !isAdmin) {
              return;
            }

            return (
              <Link
                key={item.key}
                to={item.key}
                className="flex items-center justify-center text-center"
              >
                <Tooltip title={item.label}>
                  <StyledMenuItem key={item.key} active={checkActive(item.key)}>
                    <IconRenderer
                      icon={item.icon}
                      active={checkActive(item.key)}
                    />
                  </StyledMenuItem>
                </Tooltip>
              </Link>
            );
          })}
      </MenuList>
    </Drawer>
  );
};
