import React from 'react';

const StatCard = ({ data }) => {
  return (
    <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className={`p-3 ${data.iconBg} rounded-xl flex items-center justify-center`}>
          <span className={`material-symbols-outlined ${data.iconColor}`}>
            {data.icon}
          </span>
        </div>

        {data.change && (
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
            {data.change}
          </span>
        )}

        {data.badge && (
          <span
            className={`text-xs font-bold ${data.badgeColor} ${data.badgeBg} px-2 py-1 rounded-full`}
          >
            {data.badge}
          </span>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {data.label}
        </h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {data.value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
