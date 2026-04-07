import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import AiroErrorBoundary from '../dev-tools/src/AiroErrorBoundary';
import CookieBannerErrorBoundary from '@/components/CookieBannerErrorBoundary';
import RootLayout from './layouts/RootLayout';
import Spinner from './components/Spinner';
import { routes } from './routes';
import { LanguageProvider } from '@/lib/language';

const CookieBanner = lazy(() =>
  import('@/components/CookieBanner').catch((error) => {
    console.warn('Failed to load CookieBanner:', error);
    return { default: () => null };
  })
);

const SpinnerFallback = () => (
  <div className="flex justify-center py-8 h-screen items-center">
    <Spinner />
  </div>
);

/**
 * LanguageProvider wraps RootLayout *inside* the router element so that
 * every component rendered by React Router — including Outlet children —
 * is a descendant of the single shared LanguageContext. This guarantees
 * that calling useLanguage() anywhere in the tree reads from the same
 * state and re-renders immediately when the language is toggled.
 */
const AppShell = () => (
  <LanguageProvider>
    <RootLayout>
      <Outlet />
    </RootLayout>
  </LanguageProvider>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: import.meta.env.MODE === 'development' ? (
      <AiroErrorBoundary>
        <Suspense fallback={<SpinnerFallback />}>
          <AppShell />
        </Suspense>
      </AiroErrorBoundary>
    ) : (
      <Suspense fallback={<SpinnerFallback />}>
        <AppShell />
      </Suspense>
    ),
    children: routes,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <CookieBannerErrorBoundary>
        <Suspense fallback={null}>
          <CookieBanner />
        </Suspense>
      </CookieBannerErrorBoundary>
    </>
  );
}
