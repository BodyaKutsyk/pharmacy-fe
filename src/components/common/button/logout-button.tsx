import { useState } from 'react';

import { Box, Dialog, DialogTitle } from '@mui/material';
import { LogOutIcon } from 'lucide-react';

import Button from '@/components/common/button/index';
import { useAuth } from '@/hooks/useAuth.ts';

const LogoutButton = () => {
  const [openLogOutModal, setOpenLogOutModal] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setOpenLogOutModal(false);
  };

  return (
    <>
      <Dialog open={openLogOutModal} onClose={() => setOpenLogOutModal(false)}>
        <DialogTitle>Are your sure you want to log out?</DialogTitle>

        <Box
          sx={{
            padding: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleLogout}
          >
            Logout
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setOpenLogOutModal(false)}
          >
            Cancel
          </Button>
        </Box>
      </Dialog>
      <Button
        startIcon={<LogOutIcon />}
        onClick={() => setOpenLogOutModal(true)}
      />
    </>
  );
};

export default LogoutButton;
