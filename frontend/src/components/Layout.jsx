import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  const location = useLocation();
  const path = location.pathname.split('/')[1];
  const title = path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={title === 'Crm' ? 'CRM & Order Desk' : title} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
