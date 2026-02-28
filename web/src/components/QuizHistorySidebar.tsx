import { useEffect, useState } from "react";
import { quizApi } from "@/services/quizApi";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface QuizHistoryItem {
  _id: string;
  title: string;
  completedAt: string;
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-6 left-3 h-full bg-gradient-to-br from-teal-600/90 via-cyan-400/40 to-teal-700/40 text-white rounded-2xl z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-72 border-r border-blue-700/50 shadow-2xl`}
      >
        <div className="p-4 border-b border-blue-700/50 flex items-center justify-between">
          <h2 className="text-xl text-blue-900 font-extrabold">Quiz History</h2>
          <button 
            onClick={onToggle} 
            className="relative group text-blue-900 hover:text-cyan-300 p-2 rounded-lg hover:bg-blue-700/30 transition-all hover:scale-110"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 bg-blue-900/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Hide sidebar
            </span>
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-80px)] p-4">
          {loading ? (
            <div className="text-center  py-8">Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-lg text-blue-900 font-extrabold">Your quizzes will appear here</p>
              <p className="text-lg text-blue-900 font-extrabold">Take your first quiz to get started!</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {history.map((item) => (
                <li key={item._id}>
                  <Link
                    href={`/history/${item._id}`}
                    className={`block p-3 rounded-lg hover:bg-blue-700/50 transition-all ${
                      pathname === `/history/${item._id}` ? "bg-blue-700/70" : ""
                    }`}
                  >
                    <div className="font-semibold text-sm truncate">{item.title}</div>
                    <div className="text-xs text-blue-300 mt-1">
                      {new Date(item.completedAt).toLocaleDateString()} • {item.percentageScore.toFixed(0)}%
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