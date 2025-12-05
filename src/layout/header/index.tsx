import { Box } from '@mui/material';
import { FaPrescriptionBottleMedical } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

import { ButtonTheme } from '@/components';
import LogoutButton from '@/components/common/button/logout-button.tsx';

const HeaderComponent = () => {
  return (
    <header className="dark:bg-[#061406] border-b  block fixed w-full inset-x-0 z-30 h-16 px-4 shadow-xl">
      <div className="w-full h-full flex items-center justify-between mx-auto">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              className="italic font-semibold"
              to="/"
            >
              <FaPrescriptionBottleMedical size={25} />
              Good Weed
            </Link>
          </div>
          <Box>
            <ButtonTheme />
            <LogoutButton />
          </Box>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
