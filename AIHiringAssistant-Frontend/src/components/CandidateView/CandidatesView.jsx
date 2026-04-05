import React, { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
import { getUsersApi } from "../../api/user.api";
import { useSearch } from "../../context/SearchContext";
import { toast } from "react-toastify";
// import { getCandidateInsight } from '../services/geminiService';

const CandidateCard = ({ candidate }) => {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchInsight = async () => {
      // const data = await getCandidateInsight(candidate.name, candidate.role);
      const data = null;
      setInsight(data);
      setLoading(false);
    };
    fetchInsight();
  }, [candidate]);

  return (
    <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 p-6 flex flex-col h-full hover:shadow-2xl hover:shadow-primary/5 transition-all group">
      <div className="flex justify-between items-start">
        <div className="relative">
          <img
            src={candidate.avatar}
            alt={candidate.fullName}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-primary/5"
          />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-white dark:ring-gray-900 shadow-lg">
            {candidate.match}%
          </div>
        </div>

        <button className="p-2 text-gray-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">bookmark_add</span>
        </button>
      </div>

      <div className="mt-4 flex-1">
        <h3 className="font-bold text-lg">{candidate.fullName}</h3>
        <p className="text-primary text-sm font-semibold">{candidate.role}</p>

        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
          <span className="material-symbols-outlined text-[14px]">
            location_on
          </span>
          {candidate.location}
          <span className="mx-1">•</span>
          {candidate.experience}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(candidate.skills || []).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* <div className="mt-3 text-xs text-gray-500 dark:text-gray-300">
          <span className="font-semibold">Email:</span> {candidate.email || "Not available"}
        </div> */}

        <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-sm">
              auto_awesome
            </span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Match Insight
            </span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed italic">
            {loading ? "AI is analyzing resume..." : insight}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-50 dark:border-white/5 flex gap-2">
        <button
          onClick={() =>
            window.open(`/profile?userId=${candidate.id}`, "_blank")
          }
          className="flex-1 py-2.5 bg-[#ec5b13] dark:bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-green-700 dark:hover:bg-white/20 transition-all"
        >
          View Profile
        </button>
        <button
          onClick={() => {
            if (candidate.email) {
              window.location.href = `mailto:${candidate.email}`;
            }
          }}
          disabled={!candidate.email}
          className="flex-1 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {candidate.email ? "Mail" : "Email not set"}
        </button>
      </div>
    </div>
  );
};

const CandidatesView = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { searchQuery } = useSearch();

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true);
        const response = await getUsersApi(currentPage);
        if (response.data.error === false) {
          const content = response.data.data.content || [];
          // map skills string to array and take first 3
          const parsed = content.map((u) => {
            const skillsArr = [];
            try {
              const arr = JSON.parse(u.skills);
              if (Array.isArray(arr)) skillsArr.push(...arr.slice(0, 3));
            } catch { }
            return {
              id: u.userId,
              avatar: u.avatar || "",
              match: u.matchPercentage,
              fullName: u.fullName,
              role: u.currentRole,
              location: u.location,
              experience: u.experience + " yrs",
              skills: skillsArr,
              email: u.email,
            };
          });
          setCandidates(parsed);
          setTotalPages(response.data.data.totalPages);
          // toast.success(response.data.message);
        } else {
          setError("Failed to fetch candidates");
          toast.error(response.data.message || "Failed to fetch candidates");
        }
      } catch (err) {
        setError("Failed to fetch candidates");
        toast.error("Failed to fetch candidates");
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    };

    loadCandidates();
  }, [currentPage]);

  // Filter candidates based on search query
  const filteredCandidates = candidates.filter((candidate) => {
    const searchLower = searchQuery.toLowerCase();

    return (
      (candidate.fullName &&
        candidate.fullName.toLowerCase().includes(searchLower)) ||
      (candidate.role && candidate.role.toLowerCase().includes(searchLower)) ||
      (candidate.location &&
        candidate.location.toLowerCase().includes(searchLower)) ||
      (candidate.skills &&
        candidate.skills.some((skill) =>
          skill.toLowerCase().includes(searchLower),
        ))
    );
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Talent Pool</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Discover top-tier talent mapped to your open roles.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-1.5 rounded-xl">
          <button className="p-2 bg-gray-900 dark:bg-white/20 text-white rounded-lg">
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <span className="material-symbols-outlined">list</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCandidates.length > 0 ? (
          filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center h-64 text-gray-500">
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl mb-2 block">
                search_off
              </span>
              <p>No candidates found matching "{searchQuery}"</p>
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidatesView;
