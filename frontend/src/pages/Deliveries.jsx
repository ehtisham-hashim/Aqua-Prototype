import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { loadData } from '../utils/dataLoader';

export default function Deliveries() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await loadData('aquasphere', 'orders.json');
      setOrders(data);
    }
    fetchData();
  }, []);

  const columns = [
    { header: 'Order ID', accessorKey: 'id' },
    { header: 'Type', accessorKey: 'orderType' },
    { header: 'Status', cell: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        row.deliveryStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
      }`}>
        {row.deliveryStatus}
      </span>
    ) },
    { header: 'Expected', accessorKey: 'expectedDelivery' },
    { header: 'Total Charged', cell: (row) => `Rs. ${(row.totalCharged || 0).toLocaleString()}` }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Deliveries Ledger</h2>
        <DataTable columns={columns} data={orders} />
      </div>
    </div>
  );
}
