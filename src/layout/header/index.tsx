import GrassIcon from '@mui/icons-material/Grass';
import { Link } from 'react-router-dom';

import { ButtonTheme } from '@/components';
import { navList } from '@/data/constant/navs';
import { useActiveMenu } from '@/hooks';

const HeaderComponent = () => {
  const { checkActive } = useActiveMenu();

  return (
    <header className="dark:bg-[#061406] border-b  block fixed w-full inset-x-0 z-30 h-16 px-4 shadow-xl">
      <div className="w-full h-full flex items-center justify-between mx-auto">
        <div className="w-full flex justify-between items-center">
          {/*<div className="flex gap-5">*/}
          {/*  {navList.map((item) => (*/}
          {/*    <Link key={item.key} to={item.key}>*/}
          {/*      <span*/}
          {/*        className={`${checkActive(item.key) && 'border-b border-[#1b1b1b] dark:border-[#dcedc8]'}  uppercase font-bold text-sm px-4 py-2 transition-all duration-150`}*/}
          {/*      >*/}
          {/*        {item.label}*/}
          {/*      </span>*/}
          {/*    </Link>*/}
          {/*  ))}*/}
          {/*</div>*/}
          <div className="flex items-center gap-2">
            <GrassIcon />
            <span className="italic font-semibold">Good Weed</span>
          </div>
          <ButtonTheme />
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
