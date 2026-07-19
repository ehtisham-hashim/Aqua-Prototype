import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Crm from './pages/Crm';
import Deliveries from './pages/Deliveries';
import Production from './pages/Production';
import Purchases from './pages/Purchases';
import Expenses from './pages/Expenses';
import Closing from './pages/Closing';
import Blowing from './pages/Blowing';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="crm" element={<Crm />} />
          <Route path="deliveries" element={<Deliveries />} />
          <Route path="production" element={<Production />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="closing" element={<Closing />} />
          <Route path="blowing" element={<Blowing />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
