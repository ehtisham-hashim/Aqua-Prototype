import React from 'react';

export default function DataTable({ columns, data }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {columns.map((col, j) => (
                <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {col.cell ? col.cell(row) : row[col.accessorKey]}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-gray-500">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
