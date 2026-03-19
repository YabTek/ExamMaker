"use client";

import { useEffect, useState } from "react";
import { quizApi, UserStats, QuizAttempt } from "@/services/quizApi";
import { useRouter } from "next/navigation";

export default function Analytics() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [allTrendData, setAllTrendData] = useState<Array<{ date: string; score: number }>>([]);
  const [filteredTrend, setFilteredTrend] = useState<Array<{ date: string; score: number }>>([]);
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          quizApi.getUserAnalytics(),
          quizApi.getUserHistory(10)
        ]);
        setStats(statsRes.data);
        setAllTrendData(statsRes.data.recentTrend || []);
        setFilteredTrend(statsRes.data.recentTrend || []);
        setHistory(historyRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!allTrendData.length) return;

    let filtered = [...allTrendData];

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(item => new Date(item.date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); 
      filtered = filtered.filter(item => new Date(item.date) <= end);
    }

    setFilteredTrend(filtered);
    setCurrentPage(1); 
  }, [startDate, endDate, allTrendData]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTrend = filteredTrend.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredTrend.length / itemsPerPage);

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-300 via-cyan-400 to-teal-400">
      <div className="text-center p-8 bg-blue-700/40 backdrop-blur-md rounded-2xl shadow-xl border border-cyan-300/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white font-semibold text-lg">Loading your analytics...</p>
      </div>
    </div>
  );
    
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-teal-600/20 via-cyan-400/40 to-teal-700/40"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-teal-700 via-transparent to-teal-700 animate-pulse"></div>
      
      <div className="fixed top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"></div>
      <div className="fixed top-1/2 left-1/3 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl"></div>
      
      <div className="relative w-full p-8 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-10 text-center drop-shadow-lg">
          📊 Your Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="group bg-cyan-500/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/40 hover:bg-cyan-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <h3 className="text-blue-900 text-sm font-semibold uppercase tracking-wide mb-2">Total Quizzes</h3>
            <p className="text-4xl font-bold text-blue-900">
              {stats?.totalAttempts || 0}
            </p>
          </div>
          <div className="group bg-cyan-500/40 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/40 hover:bg-cyan-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <h3 className="text-blue-900 text-sm font-semibold uppercase tracking-wide mb-2">Average Score</h3>
            <p className="text-4xl font-bold text-blue-900">
              {stats?.averageScore.toFixed(1) || 0}%
            </p>
          </div>
          <div className="group bg-cyan-500/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/40 hover:bg-cyan-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <h3 className="text-blue-900 text-sm font-semibold uppercase tracking-wide mb-2">Best Score</h3>
            <p className="text-4xl font-bold text-blue-900">
              {stats?.bestScore || 0}%
            </p>
          </div>
          <div className="group bg-cyan-500/40 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/40 hover:bg-cyan-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <h3 className="text-blue-900 text-sm font-semibold uppercase tracking-wide mb-2">Time Spent</h3>
            <p className="text-4xl font-bold text-blue-900">
              {Math.floor((stats?.totalTimeSpent || 0) / 60)}m
            </p>
          </div>
        </div>

        <div className="bg-cyan-100/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-10 border border-white/40">
          <h2 className="text-3xl font-bold mb-6 text-blue-900">
            📈 Recent Performance Trend
          </h2>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-blue-700/30">
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">From Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:outline-none bg-white/30 text-blue-900 font-semibold shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-2">To Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:outline-none bg-white/30 text-blue-900 font-semibold shadow-md"
                />
              </div>
              <button
                onClick={clearFilters}
                className="px-4 py-2 mt-6 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg"
              >
                Clear Filters
              </button>
            </div>
            
            {paginatedTrend && paginatedTrend.length > 0 ? (
              <>
                <div className="flex gap-4">
                <div className="flex flex-col justify-between h-80">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-900 bg-white/20 px-2 py-1 rounded">100%</span>
                    <div className="w-2 h-0.5 bg-blue-700"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-900 bg-white/20 px-2 py-1 rounded">75%</span>
                    <div className="w-2 h-0.5 bg-blue-700"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-900 bg-white/20 px-2 py-1 rounded">50%</span>
                    <div className="w-2 h-0.5 bg-blue-700"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-900 bg-white/20 px-2 py-1 rounded">25%</span>
                    <div className="w-2 h-0.5 bg-blue-700"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-900 bg-white/20 px-2 py-1 rounded">0%</span>
                    <div className="w-2 h-0.5 bg-blue-700"></div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="relative h-80 border-l-2 border-b border-blue-700">
                    <div className="absolute top-0 left-0 right-0 h-full pointer-events-none">
                      <div className="absolute top-0 left-0 right-0 border-t-2 border-blue-400/20"></div>
                      <div className="absolute top-1/4 left-0 right-0 border-t border-blue-400/30"></div>
                      <div className="absolute top-1/2 left-0 right-0 border-t border-blue-400/30"></div>
                      <div className="absolute top-3/4 left-0 right-0 border-t border-blue-400/30"></div>
                      <div className="absolute bottom-0 left-0 right-0 border-t border-blue-400/30"></div>
                    </div>

                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                      <polyline
                        points={paginatedTrend.map((item, idx) => {
                          const x = ((idx + 0.5) / paginatedTrend.length) * 100;
                          const y = 100 - item.score;
                          return `${x}%,${y}%`;
                        }).join(' ')}
                        fill="none"
                        stroke="#1e40af"
                        strokeWidth="3"
                        className="drop-shadow-lg"
                      />
                    </svg>

                    <div className="absolute inset-0 flex justify-around px-2">
                      {paginatedTrend.map((item, idx) => {
                        const bottomPosition = item.score;
                        
                        return (
                          <div key={idx} className="flex flex-col items-center flex-1 relative h-full">
                            <div 
                              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 group"
                              style={{ bottom: `${bottomPosition}%` }}
                            >
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-blue-900 bg-white/70 px-2 py-1 rounded shadow-md whitespace-nowrap">
                                {item.score}%
                              </span>
                              
                              <div className="relative">
                                <div className="w-4 h-4 bg-blue-700 rounded-full border-2 border-white shadow-lg cursor-pointer group-hover:w-5 group-hover:h-5 transition-all"></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-start justify-around gap-1 mt-3 px-2">
                    {paginatedTrend.map((item, idx) => (
                      <div key={idx} className="flex-1 text-center">
                        <span className="text-xs font-semibold text-blue-900 bg-white/20 px-2 py-1 rounded shadow inline-block">
                          {new Date(item.date).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="transform -rotate-90 origin-center absolute left-0 top-1/2 -translate-x-8">
                  <span className="text-sm font-bold text-blue-900 bg-cyan-400 px-3 py-1 rounded-lg shadow-md">Score (%)</span>
                </div>
                <div className="mx-auto">
                  <span className="text-sm font-bold text-blue-900 bg-cyan-400 px-3 py-1 rounded-lg shadow-md">Quiz Date</span>
                </div>
              </div>
              <div className="mt-4 text-sm text-blue-800 font-semibold text-center">
                Showing {paginatedTrend.length} of {filteredTrend.length} quiz results
                {(startDate || endDate) && " (filtered)"}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded font-semibold transition-all"
                  >
                    ← Prev
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 text-xs rounded font-bold transition-all ${
                          currentPage === page
                            ? 'bg-blue-700 text-white'
                            : 'bg-white/60 text-blue-900 hover:bg-blue-500 hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded font-semibold transition-all"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-blue-800">
                {filteredTrend.length === 0 && (startDate || endDate)
                  ? "No quiz data found for the selected date range."
                  : "No quiz data yet. Take some quizzes to see your performance trend!"}
              </p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}