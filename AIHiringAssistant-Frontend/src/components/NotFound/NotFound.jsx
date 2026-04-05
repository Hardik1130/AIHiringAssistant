import React from "react";

const NotFound = ({ onClear }) => {
  return (
    <>
      <section className="flex-grow flex flex-col items-center justify-center min-h-[500px] bg-white rounded-3xl border border-dashed border-gray-200">
        {/* Empty State Illustration */}
        <div className="mb-8 relative">
          <div className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute w-full h-full border border-slate-100 rounded-full scale-110"></div>
            <div className="absolute w-full h-full border border-slate-100 rounded-full scale-75"></div>
            <div className="z-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <svg
                className="w-16 h-16 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                ></path>
                <path
                  d="M10 7v6m4-3h-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                ></path>
              </svg>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
            No Match
          </div>
          <div className="absolute -bottom-2 -left-2 bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
            Filtered
          </div>
        </div>

        {/* Empty State Text Content */}
        <div className="text-center max-w-sm px-6">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            No candidates match your filters
          </h3>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            We couldn't find any applicants who meet your current search
            criteria. Try adjusting your filters or clearing them to see more
            results.
          </p>
          <button
            onClick={onClear}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Clear All Filters
          </button>
        </div>
      </section>
    </>
  );
};

export default NotFound;
