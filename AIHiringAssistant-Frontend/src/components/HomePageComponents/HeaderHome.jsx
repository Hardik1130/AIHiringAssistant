import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const HeaderHome = ({ jobCount, onSearch, userRole }) => {
  return (
    <header
      className="border-b border-slate-200 sticky top-0 z-50"
      style={{ backgroundColor: '#3A9AFF' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">

          {/* Left: Title */}
          <div className="shrink-0">
            <h1 className="text-xl font-bold text-white">
              Available Jobs
            </h1>
          </div>

          {/* Middle: Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search jobs, skills..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-white"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Right: Actions */}

          <div className="flex items-center gap-4 shrink-0">
            {/* Open Positions */}
            <span className="text-sm font-medium px-3 py-1.5 bg-white text-[#3A9AFF] rounded-full">
              {jobCount} Open
            </span>

            {/* HR Only */}
            {userRole === 'HR' && (
              <button
                className="
                  h-11 px-6
                  flex items-center gap-2
                  text-sm font-semibold
                  bg-white text-primary
                  rounded-xl
                  border border-white/60
                  shadow-sm
                  hover:bg-primary hover:text-white
                  hover:shadow-md
                  transition-all duration-200
                "
              >
                <span className="text-lg leading-none">＋</span>
                Post Job 
              </button>
            )}


            {/* User Profile */}
            <button
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition "
              aria-label="User Profile"
              style={{ backgroundColor: '#3A9AFF' }}
            >
              <FaUserCircle className="text-2xl text-white" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default HeaderHome


// --Not Needed