
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Funds from './pages/Funds';
import Schemes from './pages/Schemes';
import DataLoader from './pages/DataLoader';
import FundHouses from './pages/FundHouses';

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
        path: 'funds',
        element: <Funds />,
      },
      {
        path: 'schemes',
        element: <Schemes />,
      },
      {
        path: 'loader',
        element: <DataLoader />,
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
