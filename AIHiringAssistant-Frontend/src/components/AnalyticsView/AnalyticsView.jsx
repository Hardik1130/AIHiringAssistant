import React, { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
import { fetchApplicantFlow } from "../../api/analytics.api";
// ✅ ADD THIS
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AnalyticsView = () => {
  const [chartData, setChartData] = useState([]);
  // const [maxCount, setMaxCount] = useState(20);
  const [monthYear, setMonthYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthTotalCount, setMonthTotalCount] = useState(0);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const MIN_LOADING_MS = 2000;
      const start = Date.now();

      try {
        setLoading(true);
        setError(null);

        const response = await fetchApplicantFlow();
        const data = response.data;
        console.log("API Response:", data);

        // Validate API response structure
        if (!data || !data.dailyFlow || !Array.isArray(data.dailyFlow)) {
          throw new Error("Invalid API response structure");
        }

        // Format month and year from API response
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const month = Number(data.month) || new Date().getMonth() + 1;
        const year = Number(data.year) || new Date().getFullYear();
        const monthName = monthNames[month - 1] || "Unknown";
        setMonthYear(`${monthName} ${year}`);
        setMonthTotalCount(data.monthTotalCount || 0);

        // Ensure we show a bar for every day of the month
        const daysInMonth = new Date(year, month, 0).getDate();
        const dataByDay = (data.dailyFlow || []).reduce((acc, item) => {
          acc[item.day] = item.count;
          return acc;
        }, {});

        // const transformedData = Array.from({ length: daysInMonth }, (_, i) => {
        //   const day = i + 1;
        //   const count = Number(dataByDay[day] || 0);

        //   return {
        //     day,
        //     count,
        //     color: count > 0 ? "bg-primary" : "bg-slate-300",
        //   };
        // });

        // ✅ NEW CODE (ADD THIS)
        const chartFormattedData = (data.dailyFlow || []).map((item) => ({
          day: item.day,
          applications: item.count,
        }));

        setChartData(chartFormattedData);

        // setChartData(transformedData);

        // Keep max count fixed at 20 as requested
        // setMaxCount(20);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Generate y-axis labels (5, 10, 15, etc.)
  // const yAxisLabels = Array.from(
  //   { length: Math.ceil(maxCount / 5) },
  //   (_, i) => (i + 1) * 5,
  // );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Recruiting Performance
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Real-time metrics on candidate flow and conversion.
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-8 shadow-sm w-full">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-gray-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Recruiting Performance
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Real-time metrics on candidate flow and conversion.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Full Width Chart Card */}
        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-8 shadow-sm w-full">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold">
                Applicant Flow - {monthYear}
              </h3>
              <p className="text-sm text-gray-400">
                Daily candidate submissions across all active roles.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-500">
                {monthTotalCount}
              </span>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Total Applications
              </p>
            </div>
          </div>

          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" />

                <YAxis allowDecimals={false} tickCount={10} />

                <Tooltip />

                <Bar
                  dataKey="applications"
                  radius={[8, 8, 0, 0]}
                  fill="#10B981"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
