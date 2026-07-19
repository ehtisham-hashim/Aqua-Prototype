import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Dashboard, People, LocalShipping, Factory,
  Inventory, AttachMoney, Lock, AutoAwesome,
  BarChart, Settings
} from '@mui/icons-material';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/' },
  { label: 'CRM & Orders', icon: <People />, path: '/crm' },
  { label: 'Deliveries', icon: <LocalShipping />, path: '/deliveries' },
  { label: 'PET Production', icon: <Factory />, path: '/production' },
  { label: 'Purchases', icon: <Inventory />, path: '/purchases' },
  { label: 'Expenses', icon: <AttachMoney />, path: '/expenses' },
  { label: 'Daily Closing', icon: <Lock />, path: '/closing' },
  { label: 'Blowing Division', icon: <AutoAwesome />, path: '/blowing' },
  { label: 'Reports', icon: <BarChart />, path: '/reports' },
  { label: 'Settings', icon: <Settings />, path: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col hidden md:flex">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-sky-600">Aqua Sphere OS</h2>
        <span className="text-sm text-gray-500">Management System</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-sky-100 text-sky-800 px-4 py-2 rounded-lg text-center font-semibold">
          AquaSphere
        </div>
      </div>
    </aside>
  );
}
