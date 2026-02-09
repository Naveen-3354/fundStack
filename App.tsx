
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Funds from './pages/Funds';
import Schemes from './pages/Schemes';
import DataLoader from './pages/DataLoader';
import FundHouses from './pages/FundHouses';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fund-houses" element={<FundHouses />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/loader" element={<DataLoader />} />
          <Route path="*" element={<div className="p-12 text-center text-slate-400 italic">Route not found in Admin Shell.</div>} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
