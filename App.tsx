
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Schemes from './pages/Schemes';
import DataLoader from './pages/DataLoader';
import FundHouses from './pages/FundHouses';
import SchemeDetail from './pages/SchemeDetail';
import SchemeMigration from './pages/SchemeMigration';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'fund-houses',
        element: <FundHouses />,
      },
      {
        path: 'schemes',
        element: <Schemes />,
      },
      {
        path: 'schemes/:id',
        element: <SchemeDetail />,
      },
      {
        path: 'loader',
        element: <DataLoader />,
      },
      {
        path: 'scheme-migration',
        element: <SchemeMigration />,
      },
      {
        path: '*',
        element: <div className="p-12 text-center text-slate-400 italic">Route not found in Admin Shell.</div>,
      },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
