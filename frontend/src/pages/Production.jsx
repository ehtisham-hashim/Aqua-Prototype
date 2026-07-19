import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { loadData } from '../utils/dataLoader';

export default function Production() {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await loadData('aquasphere', 'production_batches.json');
      setBatches(data);
    }
    fetchData();
  }, []);

  const columns = [
    { header: 'Batch ID', accessorKey: 'id' },
    { header: 'Date', accessorKey: 'productionDate' },
    { header: '0.5L Packs', accessorKey: 'qty05LProduced' },
    { header: '1.5L Packs', accessorKey: 'qty15LProduced' },
    { header: 'Sodium (kg)', accessorKey: 'sodiumConsumed' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Production History</h2>
        <DataTable columns={columns} data={batches} />
      </div>
    </div>
  );
}
