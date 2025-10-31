import { lazy } from 'react';

const Home = lazy(() => import('@/pages/home'));
const Login = lazy(() => import('@/pages/login'));
const RegisterCustomer = lazy(() => import('@/pages/register-customer'));

export { Home, Login, RegisterCustomer };
