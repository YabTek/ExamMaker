import { useEffect, useState } from "react";
import { quizApi } from "@/services/quizApi";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface QuizHistoryItem {
  _id: string;
  title: string;
  completedAt: string;
  score: number;
  totalQuestions: number;
  percentageScore: number;
}

export default function QuizHistorySidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await quizApi.getUserHistory(50);
        setHistory(res.data.data || []);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed top-6 left-3 h-[calc(100vh-3rem)] 
          bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-600
          lg:from-teal-600/90 lg:via-cyan-400/40 lg:to-teal-700/40
          text-white lg:text-blue-900
          rounded-2xl 
          transition-transform duration-300 
          w-72 border-2 border-teal-400 lg:border-r lg:border-blue-700/50 shadow-2xl overflow-hidden
          ${isOpen ? "translate-x-0 z-40 lg:z-10" : "-translate-x-full lg:translate-x-0 lg:z-10"}
          lg:translate-x-0
        `}
      >
        <div className="p-4 border-b-2 border-teal-700/70 lg:border-b lg:border-blue-700/50 flex items-center justify-between bg-teal-600/30 lg:bg-transparent">
          <h2 className="text-xl text-white lg:text-blue-900 font-extrabold drop-shadow lg:drop-shadow-none">Quiz History</h2>
          <button 
            onClick={onToggle} 
            className="relative group text-white lg:text-blue-900 hover:text-cyan-100 lg:hover:text-cyan-300 p-2 rounded-lg hover:bg-teal-700/50 lg:hover:bg-blue-700/30 transition-all hover:scale-110 lg:hidden"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 bg-blue-900/90 lg:bg-blue-900/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Hide sidebar
            </span>
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-80px)] p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-teal-700/5 [&::-webkit-scrollbar-thumb]:bg-cyan-500/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-teal-600/5 [&::-webkit-scrollbar-thumb]:min-h-[20px] hover:[&::-webkit-scrollbar-thumb]:bg-cyan-400/20">
          {loading ? (
            <div className="text-center text-white lg:text-blue-900 font-semibold py-8">Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-lg text-white lg:text-blue-900 font-extrabold drop-shadow lg:drop-shadow-none">Your quizzes will appear here</p>
              <p className="text-lg text-white lg:text-blue-900 font-extrabold drop-shadow lg:drop-shadow-none">Take your first quiz to get started!</p>
            </div>
          ) : (
            <ul className="space-y-0">
              {history.map((item) => (
                <li key={item._id} className="border-b-2 border-teal-700/50 lg:border-blue-700">
                  <Link
                    href={`/history/${item._id}`}
                    className={`block py-4 px-2 rounded-lg lg:rounded-none transition-all ${
                      pathname === `/history/${item._id}` 
                        ? "bg-teal-700/60 lg:bg-blue-700/50 shadow-md lg:shadow-none" 
                        : "hover:bg-teal-600/40 lg:hover:bg-blue-500/20"
                    }`}
                  >
                    <div className="font-extrabold text-base text-white lg:text-blue-900 drop-shadow lg:drop-shadow-none truncate mb-2">{item.title}</div>
                    <div className="text-sm text-white lg:text-blue-900 font-bold flex items-center justify-between drop-shadow lg:drop-shadow-none">
                      <span>{new Date(item.completedAt).toLocaleDateString()}</span>
                      <span className="bg-white/20 lg:bg-transparent px-2 py-1 lg:px-0 lg:py-0 rounded lg:rounded-none">{item.score}/{item.totalQuestions}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}