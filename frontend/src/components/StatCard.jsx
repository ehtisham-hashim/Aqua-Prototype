import React from 'react';

export default function StatCard({ title, value, subtitle, type = 'default' }) {
  const colorMap = {
    default: 'text-gray-900',
    success: 'text-emerald-600',
    warning: 'text-amber-500',
    danger: 'text-rose-600',
    info: 'text-sky-500'
  };

  const valueColor = colorMap[type] || colorMap.default;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <div className={`text-2xl font-bold ${valueColor} mb-1`}>{value}</div>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
}
