import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { loadData } from '../utils/dataLoader';

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await loadData('aquasphere', 'purchases.json');
      setPurchases(data);
    }
    fetchData();
  }, []);

  const columns = [
    { header: 'Purchase ID', accessorKey: 'id' },
    { header: 'Vendor ID', accessorKey: 'vendorId' },
    { header: 'Date', accessorKey: 'purchasedAt' },
    { header: 'Quantity', accessorKey: 'qty' },
    { header: 'Total Cost', cell: (row) => `Rs. ${(row.totalCost || 0).toLocaleString()}` }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Purchase Logs</h2>
        <DataTable columns={columns} data={purchases} />
      </div>
    </div>
  );
}
