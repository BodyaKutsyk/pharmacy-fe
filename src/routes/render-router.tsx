import { FC, lazy } from 'react';

import { Navigate, useRoutes } from 'react-router-dom';

import { routeList } from '@/data/constant/navs';
import { useAuth } from '@/hooks/useAuth.ts';
import LayoutComponent from '@/layout';

const NotFound = lazy(() => import('@/pages/not-found'));

const routes = (isAuthenticated: boolean = false) => [
  {
    path: '/',
    element: <LayoutComponent />,
    children: [
      {
        index: true,
        element: <Navigate to={isAuthenticated ? '/home' : '/login'} replace />,
      },
      ...routeList,
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

const RenderRouter: FC = () => {
  const { isAuthenticated } = useAuth();

  return useRoutes(routes(isAuthenticated));
};

export default RenderRouter;
