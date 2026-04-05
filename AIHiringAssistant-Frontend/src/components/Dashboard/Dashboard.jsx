// import React, { useState, useEffect } from 'react';
// import StatCard from '../Banner/StatCard'
// import HeroBanner from '../Banner/HeroBanner';
// import Header from '../HeaderComponents/Header';
// // import { generateJobDescription } from '../services/geminiService';

// const MOCK_STATS = [
//   {
//     label: 'Active Jobs',
//     value: 42,
//     change: '+12%',
//     icon: 'work',
//     iconBg: 'bg-blue-500/10',
//     iconColor: 'text-blue-500'
//   },
//   {
//     label: 'Total Candidates',
//     value: '1,284',
//     change: '+5%',
//     icon: 'groups',
//     iconBg: 'bg-primary/10',
//     iconColor: 'text-primary'
//   },
//   {
//     label: 'AI Match Rate',
//     value: '94%',
//     badge: 'AI Driven',
//     badgeBg: 'bg-primary/10',
//     badgeColor: 'text-primary',
//     icon: 'bolt',
//     iconBg: 'bg-amber-500/10',
//     iconColor: 'text-amber-500'
//   }
// ];

// const RECENT_CANDIDATES = [
//   {
//     id: '1',
//     name: 'Sarah Jenkins',
//     role: 'Sr. Backend Engineer',
//     match: 98,
//     avatar: 'https://i.pravatar.cc/150?u=sarah',
//     status: 'Interviewing'
//   },
//   {
//     id: '2',
//     name: 'Marcus Chen',
//     role: 'Full Stack Dev',
//     match: 94,
//     avatar: 'https://i.pravatar.cc/150?u=marcus',
//     status: 'Reviewing'
//   },
//   {
//     id: '3',
//     name: 'Elena Rodriguez',
//     role: 'Product Designer',
//     match: 91,
//     avatar: 'https://i.pravatar.cc/150?u=elena',
//     status: 'New'
//   }
// ];

// const Dashboard = () => {
//   const [aiTip, setAiTip] = useState('Thinking...');
//   const [loadingTip, setLoadingTip] = useState(true);

//   useEffect(() => {
//     const fetchTip = async () => {
//         const tip = null;
//     //   const tip = await generateJobDescription('Software Engineering Manager');
//       setAiTip(tip);
//       setLoadingTip(false);
//     };
//     fetchTip();
//   }, []);

//   return (
//     <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-700">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-4">
//         <div>
//           <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
//             Dashboard Overview
//           </h2>
//           <p className="text-gray-500 mt-2 text-lg">
//             Welcome back, Alex. Here's what's happening today.
//           </p>
//         </div>

//         <div className="flex gap-3 w-full sm:w-auto">
//           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-gray-600 font-bold hover:bg-gray-50 transition">
//             <span className="material-symbols-outlined text-xl">filter_list</span>
//             Filters
//           </button>

//           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary/20 transition">
//             <span className="material-symbols-outlined text-xl">file_download</span>
//             Export
//           </button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {MOCK_STATS.map((stat, idx) => (
//           <StatCard key={idx} data={stat} />
//         ))}
//       </div>

//       <HeroBanner />

//       {/* Candidates + AI Insight */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Candidates */}
//         <div className="lg:col-span-2 bg-white rounded-3xl border p-6 sm:p-8 shadow-sm">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-xl font-bold">Top Match Candidates</h3>
//             <button className="text-primary text-sm font-bold hover:underline">
//               View All
//             </button>
//           </div>

//           <div className="space-y-4">
//             {RECENT_CANDIDATES.map((c) => (
//               <div
//                 key={c.id}
//                 className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition group cursor-pointer"
//               >
//                 <div className="flex items-center gap-4">
//                   <img
//                     src={c.avatar}
//                     alt={c.name}
//                     className="w-12 h-12 rounded-xl"
//                   />
//                   <div>
//                     <h4 className="font-bold group-hover:text-primary transition">
//                       {c.name}
//                     </h4>
//                     <p className="text-xs text-gray-500">{c.role}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-6">
//                   <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full hidden sm:block">
//                     {c.match}% Match
//                   </span>

//                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
//                     c.status === 'Interviewing'
//                       ? 'bg-blue-500/10 text-blue-500'
//                       : c.status === 'Reviewing'
//                       ? 'bg-amber-500/10 text-amber-500'
//                       : 'bg-gray-100 text-gray-500'
//                   }`}>
//                     {c.status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* AI Insight */}
//         <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-2xl">
//           <div>
//             <h3 className="text-xl font-bold mb-4">
//               Drafting a new role in engineering?
//             </h3>

//             <p className="text-gray-400 text-sm italic border-l-2 border-primary pl-4">
//               {loadingTip ? 'Analyzing market trends...' : `"${aiTip}"`}
//             </p>
//           </div>

//           <div className="mt-8 space-y-3">
//             <button className="w-full py-3.5 bg-primary rounded-xl font-bold hover:opacity-90 transition">
//               Apply Market Trends
//             </button>
//             <button className="w-full py-3 bg-white/10 rounded-xl font-bold">
//               Dismiss Insight
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

//-------------------------------------------
import React, { useState, useEffect } from "react";
import StatCard from "../Banner/StatCard";
import HeroBanner from "../Banner/HeroBanner";
import Header from "../HeaderComponents/Header";
import { useAuth } from "../../context/AuthContext"; // Adjust path as needed
import { fetchDashboardData } from "../../api/dashboard.api";
// import { generateJobDescription } from '../services/geminiService';

const MOCK_STATS = [
  {
    label: "Active Jobs",
    value: 0,
    change: "+12%",
    icon: "work",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    label: "Total Candidates",
    value: "0",
    change: "+5%",
    icon: "groups",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "Total Applications",
    value: "0",
    badge: "AI Driven",
    badgeBg: "bg-primary/10",
    badgeColor: "text-primary",
    icon: "bolt",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [aiTip, setAiTip] = useState("Thinking...");
  const [loadingTip, setLoadingTip] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDashboardData();
        const responseData = response.data;
        console.log("Dashboard data:", responseData);

        if (responseData.data) {
          setDashboardData(responseData.data);
          setRecentCandidates(responseData.data.dashboardUsersList || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchTip = async () => {
  //       const tip = null;
  //   //   const tip = await generateJobDescription('Software Engineering Manager');
  //     setAiTip(tip);
  //     setLoadingTip(false);
  //   };
  //   fetchTip();
  // }, []);

  const userName = user?.fullName || "User";

  // Build dynamic stats from API data
  const dynamicStats = dashboardData
    ? [
        {
          label: "Active Jobs",
          value: dashboardData.totalJobs || 0,
          // change: "+12%",
          badge: "Active",
          icon: "work",
          iconBg: "bg-blue-500/10",
          iconColor: "text-blue-500",
        },
        {
          label: "Total Candidates",
          value: dashboardData.totalUsers || 0,
          // change: "+5%",
          badge: "Active",
          icon: "groups",
          iconBg: "bg-primary/10",
          iconColor: "text-primary",
        },
        {
          label: "Total Applications",
          value: dashboardData.totalApplicantions || 0,
          badge: "Active",
          badgeBg: "bg-primary/10",
          badgeColor: "text-primary",
          icon: "bolt",
          iconBg: "bg-amber-500/10",
          iconColor: "text-amber-500",
        },
      ]
    : MOCK_STATS;

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            Welcome back, {userName}. Here's what's happening today.
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-gray-600 font-bold hover:bg-gray-50 transition">
            <span className="material-symbols-outlined text-xl">
              filter_list
            </span>
            Filters
          </button>

          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary/20 transition">
            <span className="material-symbols-outlined text-xl">
              file_download
            </span>
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dynamicStats.map((stat, idx) => (
          <StatCard key={idx} data={stat} />
        ))}
      </div>

      <HeroBanner />

      {/* Candidates + AI Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Candidates */}
        <div className="lg:col-span-2 bg-white rounded-3xl border p-6 sm:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Top Match Candidates</h3>
            <button className="text-primary text-sm font-bold hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentCandidates.length > 0 ? (
              recentCandidates.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        c.avatar || `https://i.pravatar.cc/150?u=${c.fullName}`
                      }
                      alt={c.fullName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold group-hover:text-primary transition">
                        {c.fullName}
                      </h4>
                      <p className="text-xs text-gray-500">{c.currentRole}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full hidden sm:block">
                      {c.matchPercentage}% Match
                    </span>

                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-500">
                      Active
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                No candidates available yet.
              </p>
            )}
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-2xl">
          <div>
            <h3 className="text-xl font-bold mb-4">
              Drafting a new role in engineering?
            </h3>

            <p className="text-gray-400 text-sm italic border-l-2 border-primary pl-4">
              {loadingTip ? "Analyzing market trends..." : `"${aiTip}"`}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <button className="w-full py-3.5 bg-primary rounded-xl font-bold hover:opacity-90 transition">
              Apply Market Trends
            </button>
            <button className="w-full py-3 bg-white/10 rounded-xl font-bold">
              Dismiss Insight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
