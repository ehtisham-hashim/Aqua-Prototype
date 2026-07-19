import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { loadData } from '../utils/dataLoader';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await loadData('aquasphere', 'expenses.json');
      setExpenses(data);
    }
    fetchData();
  }, []);

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Type', accessorKey: 'type' },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Amount/Cash', cell: (row) => `Rs. ${(row.amount || row.cashReceived || 0).toLocaleString()}` },
    { header: 'Remarks', accessorKey: 'remarks' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Expenses & Spot Sales</h2>
        <DataTable columns={columns} data={expenses} />
      </div>
    </div>
  );
}
