import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { loadData } from '../utils/dataLoader';

export default function Dashboard() {
  const [stats, setStats] = useState({
    sales: 0,
    cash: 0,
    expenses: 0,
    profit: 0
  });

  useEffect(() => {
    async function fetchData() {
      const orders = await loadData('aquasphere', 'orders.json');
      const payments = await loadData('aquasphere', 'payments.json');
      const expenses = await loadData('aquasphere', 'expenses.json');

      const totalSales = orders.reduce((sum, o) => sum + (o.totalCharged || 0), 0);
      const totalCash = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

      setStats({
        sales: totalSales,
        cash: totalCash,
        expenses: totalExpenses,
        profit: totalCash - totalExpenses
      });
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={`Rs. ${stats.sales.toLocaleString()}`}
          type="info"
        />
        <StatCard
          title="Cash Collected"
          value={`Rs. ${stats.cash.toLocaleString()}`}
          type="success"
        />
        <StatCard
          title="Total Expenses"
          value={`Rs. ${stats.expenses.toLocaleString()}`}
          type="danger"
        />
        <StatCard
          title="Est. Profit"
          value={`Rs. ${stats.profit.toLocaleString()}`}
          type="warning"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to Aqua Sphere OS. Use the navigation sidebar to manage different aspects of your business.</p>
      </div>
    </div>
  );
}
