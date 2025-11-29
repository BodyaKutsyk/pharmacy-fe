import { Box } from '@mui/material';
import { FaPrescriptionBottleMedical } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

import { ButtonTheme } from '@/components';
import LogoutButton from '@/components/common/button/logout-button.tsx';
import { navList } from '@/data/constant/navs';
import { useActiveMenu } from '@/hooks';
import { useAuth } from '@/hooks/useAuth.ts';

const HeaderComponent = () => {
  const { checkActive } = useActiveMenu();
  const { isAuthenticated, isAdmin } = useAuth();

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
          {isAuthenticated && (
            <div className="flex gap-5">
              {navList.map((item) => {
                if (item.isAdmin && !isAdmin) {
                  return;
                }

                return (
                  item.label && (
                    <Link key={item.key} to={item.key}>
                      <span
                        className={`${checkActive(item.key) && 'border-b border-[#1b1b1b] dark:border-[#dcedc8]'}  uppercase font-bold text-sm px-4 py-2 transition-all duration-150`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  )
                );
              })}
            </div>
          )}

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
