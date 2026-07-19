import React from 'react';

export default function Topbar({ title = "Aqua Sphere OS" }) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Company:</span> AquaSphere
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Role:</span> Owner 👑
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </header>
  );
}
