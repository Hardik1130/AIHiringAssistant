import React, { useState, useEffect } from 'react';
// import HeaderHome from '../components/HomePageComponents/HeaderHome';
// import Footer from '../components/Footer';
import JobCard from '../components/HomePageComponents/JobCard';
import { INITIAL_JOBS } from '../dummyData/constant';

const Home = () => {
  const [jobs] = useState(INITIAL_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(INITIAL_JOBS);

  // Simple filtering logic
  useEffect(() => {
    const query = searchQuery.toLowerCase();

    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      job.category.toLowerCase().includes(query)
    );

    setFilteredJobs(filtered);
  }, [searchQuery, jobs]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* <HeaderHome
        jobCount={filteredJobs.length}
        onSearch={setSearchQuery}
        userRole="HR"
      /> */}

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <h3 className="mt-2 text-sm font-medium text-slate-900">
              No jobs found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default Home;
