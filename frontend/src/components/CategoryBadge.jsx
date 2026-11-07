import React from 'react';
import { Link } from 'react-router-dom';

const categoryColorMap = {
  Technology: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  Programming: 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200',
  'Artificial Intelligence': 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
  Cybersecurity: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
  'Web Development': 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
  Startups: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
  Productivity: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  Lifestyle: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
};

const CategoryBadge = ({ category, isLink = true, size = 'sm' }) => {
  const colorClass = categoryColorMap[category] || 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
  const sizeClasses = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  const badgeContent = (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors duration-150 ${sizeClasses} ${colorClass}`}
    >
      {category}
    </span>
  );

  if (isLink) {
    return (
      <Link
        to={`/explore?category=${encodeURIComponent(category)}`}
        onClick={(e) => e.stopPropagation()}
        className="inline-block"
      >
        {badgeContent}
      </Link>
    );
  }

  return badgeContent;
};

export default CategoryBadge;

