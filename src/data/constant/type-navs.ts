import { ReactElement } from 'react';

type NavsChild = {
  key: string;
  label?: string | ReactElement;
  element?: ReactElement;
  isAdmin?: boolean;
};

export type TypeNavs = NavsChild & {
  children?: TypeNavs[];
};

type RouteChild = {
  path: string;
  element: ReactElement;
};

export type TypeRoutes = RouteChild & {
  children?: RouteChild[];
};
