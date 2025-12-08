import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';

import fallbackRender from './error-boundary/fallbackRender';
import FooterComponent from './footer';
import HeaderComponent from './header';
import { Sidebar } from '@/layout/sidebar';

const LayoutComponent = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <HeaderComponent />
      <Sidebar />
      <div className="px-4 pt-20 flex flex-col min-h-[calc(100vh-200px)] ml-[59px] overflow-x-auto">
        <ErrorBoundary fallbackRender={fallbackRender}>
          <Suspense
            fallback={
              <div className="w-full h-full flex justify-center items-center">
                <span>Loading...</span>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </div>
      <FooterComponent />
    </div>
  );
};

export default LayoutComponent;
