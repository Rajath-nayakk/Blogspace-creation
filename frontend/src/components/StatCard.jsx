import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    rose: 'bg-rose-50 text-rose-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
          {title}
        </p>
        <h4 className="text-2xl font-extrabold text-gray-900">{value}</h4>
      </div>
      <div className={`p-3 rounded-xl ${colorStyles[color] || colorStyles.blue}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default StatCard;

