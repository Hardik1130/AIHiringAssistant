import React, { useState } from 'react';

const JobCard = ({ job }) => {
    const [isApplied, setIsApplied] = useState(false);

    const handleApply = () => {
        if (!isApplied) {
            setIsApplied(true);
        }
    };

    return (
        <article className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                            {job.title}
                        </h2>

                        {job.isVerified && (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    />
                                </svg>
                                Verified
                            </span>
                        )}
                    </div>

                    <p className="text-sm font-medium text-blue-600">
                        {job.category} • {job.location}
                    </p>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-slate-500">
                    <span className="font-semibold mr-2">Experience:</span>
                    {job.experience}
                </div>
                <div className="flex items-center text-sm text-slate-500">
                    <span className="font-semibold mr-2">Type:</span>
                    {job.type}
                </div>
            </div>

            <p className="text-slate-600 text-sm line-clamp-2 mb-4 h-10">
                {job.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
                {job.tags.map((tag) => (
                    <span
                        key={tag}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                    <p>Posted by {job.postedBy}</p>
                    <p>{job.date}</p>
                </div>

                <button
                    onClick={handleApply}
                    disabled={isApplied}
                    className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center min-w-[100px] ${isApplied
                            ? 'bg-brand-secondary text-white cursor-not-allowed'
                            : 'bg-brand-primary text-white hover:bg-blue-700 active:scale-95'
                        }`}
                >
                    {isApplied ? (
                        <>
                            <svg
                                className="w-4 h-4 mr-1.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Applied
                        </>
                    ) : (
                        'Apply'
                    )}
                </button>
            </div>
        </article>
    );
};

export default JobCard;
