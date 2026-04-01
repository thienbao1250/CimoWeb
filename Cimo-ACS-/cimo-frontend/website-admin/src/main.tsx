import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from 'contexts/AuthContext';
import CimoLoginPage from 'pages/authentication/CimoLoginPage';
import CheckInsPage from 'pages/checkins';
import ClassPage from 'pages/classes';
import ParentPage from 'pages/parents';
import PageRole from 'pages/roles';
import StudentPage from 'pages/students';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Layout from './layouts/dashboard';
import CimoDashboardPage from './pages/dashboard';
import UserPage from './pages/users';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/login',
        Component: CimoLoginPage,
      },
      {
        path: '/',
        Component: Layout,
        children: [
          { path: '', Component: CimoDashboardPage },
          {
            path: 'user',
            Component: UserPage,
            children: [
              { path: '', Component: UserPage },
              { path: 'add', Component: UserPage },
            ],
          },
          {
            path: 'role',
            Component: PageRole,
            children: [
              { path: '', Component: UserPage },
              { path: 'add', Component: UserPage },
            ],
          },

          {
            path: 'class',
            Component: ClassPage,
            children: [
              { path: '', Component: UserPage },
              { path: 'add', Component: UserPage },
            ],
          },
          {
            path: 'student',
            Component: StudentPage,
            children: [
              { path: '', Component: UserPage },
              { path: 'add', Component: UserPage },
            ],
          },
          {
            path: 'parent',
            Component: ParentPage,
            children: [
              { path: '', Component: UserPage },
              { path: 'add', Component: UserPage },
            ],
          },
          {
            path: 'checkin',
            Component: CheckInsPage,
            children: [
              { path: '', Component: UserPage },
              { path: 'add', Component: UserPage },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
