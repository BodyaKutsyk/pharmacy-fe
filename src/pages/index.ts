import { lazy } from 'react';

const Home = lazy(() => import('@/pages/home'));
const Login = lazy(() => import('@/pages/login'));
const RegisterCustomer = lazy(() => import('@/pages/register-customer'));
const RegisterMedicine = lazy(() => import('@/pages/register-medicine'));
const RegisterTransaction = lazy(() => import('@/pages/register-transaction'));
const StockAudit = lazy(() => import('@/pages/stock-audit'));
const Analytics = lazy(() => import('@/pages/analytics'));
const Pharmacists = lazy(() => import('@/pages/pharmacists'));

export {
  Home,
  Login,
  RegisterCustomer,
  RegisterMedicine,
  RegisterTransaction,
  StockAudit,
  Analytics,
  Pharmacists,
};
