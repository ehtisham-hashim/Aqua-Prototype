import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { loadData } from '../utils/dataLoader';

export default function Crm() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await loadData('aquasphere', 'customers.json');
      setCustomers(data);
    }
    fetchData();
  }, []);

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Name', accessorKey: 'name' },
    { header: 'Phone', accessorKey: 'phone' },
    { header: 'Type', accessorKey: 'customerType' },
    { header: 'Credit Limit', cell: (row) => `Rs. ${(row.creditLimit || 0).toLocaleString()}` }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Directory</h2>
        <DataTable columns={columns} data={customers} />
      </div>
    </div>
  );
}
