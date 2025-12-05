import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import { cloneDeep } from 'lodash';
import { Link } from 'react-router-dom';

import {
  ANALYTICS_PATH,
  HOME_PATH,
  LOGIN_PATH,
  PHARMACISTS_PATH,
  REGISTER_CUSTOMER,
  REGISTER_MEDICINE,
  REGISTER_TRANSACTION,
  STOCK_AUDIT,
} from './path';
import { TypeNavs, TypeRoutes } from './type-navs';
import { AuthGuard } from '@/api/authGuard.tsx';
import {
  Home,
  Login,
  RegisterCustomer,
  RegisterMedicine,
  RegisterTransaction,
  StockAudit,
  Analytics,
  Pharmacists,
} from '@/pages';
import { capitalizeFirstLetter } from '@/utils';

const navs: TypeNavs[] = [
  {
    label: 'Dashboard',
    key: HOME_PATH,
    element: (
      <AuthGuard>
        <Home />
      </AuthGuard>
    ),
    icon: DashboardIcon,
  },
  {
    label: 'Analytics',
    key: ANALYTICS_PATH,
    element: (
      <AuthGuard>
        <Analytics />
      </AuthGuard>
    ),
    icon: AssessmentIcon,
  },
  {
    label: 'Pharmacists',
    key: PHARMACISTS_PATH,
    isAdmin: true,
    element: (
      <AuthGuard admin>
        <Pharmacists />
      </AuthGuard>
    ),
    icon: GroupIcon,
  },
  {
    key: REGISTER_CUSTOMER,
    element: (
      <AuthGuard>
        <RegisterCustomer />
      </AuthGuard>
    ),
  },
  {
    key: REGISTER_MEDICINE,
    element: (
      <AuthGuard>
        <RegisterMedicine />
      </AuthGuard>
    ),
  },
  {
    key: REGISTER_TRANSACTION,
    element: (
      <AuthGuard>
        <RegisterTransaction />
      </AuthGuard>
    ),
  },
  {
    key: STOCK_AUDIT,
    element: (
      <AuthGuard>
        <StockAudit />
      </AuthGuard>
    ),
  },
  {
    key: LOGIN_PATH,
    element: <Login />,
  },
];

const getRoutes = (arr: TypeRoutes[], nav: TypeNavs, basePath = '') => {
  if (nav.children) {
    for (const n of nav.children) {
      getRoutes(arr, n, basePath + nav.key);
    }
  }
  if (!nav.element) return;

  arr.push({
    path: basePath + nav.key,
    element: nav.element,
  });

  return arr;
};

const addLink = (nav: TypeNavs, path: string) => {
  return nav.children ? (
    capitalizeFirstLetter(nav.label as string)
  ) : (
    <Link to={path}>{capitalizeFirstLetter(nav.label as string)}</Link>
  );
};

const getShowNavigation = (
  nav: TypeNavs,
  basePath = '',
): TypeNavs | undefined => {
  if (!nav.label) return;
  if (nav.children) {
    const arr: TypeNavs[] = [];
    for (const n of nav.children) {
      const formatN = getShowNavigation(n, basePath + nav.key);
      if (formatN) arr.push(formatN);
    }

    nav.children = arr.length > 0 ? arr : undefined;
  }

  return {
    key: basePath + nav.key,
    label: addLink(nav, basePath + nav.key),
    children: nav.children,
    element: nav.element,
  };
};

const menuList: TypeNavs[] = [];
const routeList: TypeRoutes[] = [];
const navList: TypeNavs[] = navs.map((nav) => ({
  key: nav.key,
  label: nav.label,
  isAdmin: nav.isAdmin,
  icon: nav.icon,
}));

for (const nav of navs) {
  const nav1 = cloneDeep(nav);
  const n = getShowNavigation(nav1);
  n && menuList.push(n);

  const nav2 = cloneDeep(nav);
  getRoutes(routeList, nav2);
}

export { routeList, menuList, navList };
