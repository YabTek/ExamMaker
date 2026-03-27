"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { quizApi, Players } from "@/services/quizApi";

interface RankedPlayer extends Players {
  rank: number;
}

export default function Result() {
  const { quizId } = useParams() as { quizId: string };
  const [players, setPlayers] = useState<RankedPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [participationType, setParticipationType] = useState<string | null>(null);

  useEffect(() => {
    const type = localStorage.getItem("participationType");
    setParticipationType(type);
  }, []);

  useEffect(() => {
    if (participationType === null) return; 

    const fetchResults = async () => {
      try {
        const res = await quizApi.fetchQuiz(quizId, true); 
        const allPlayers = res.data.players || [];
        const quizPlayers = allPlayers.filter((p: Players) => p.score !== undefined && p.score !== null);

        if (participationType === "group"){
          const sorted = [...quizPlayers].sort((a, b) => (b.score || 0) - (a.score || 0));
          
          const ranked: RankedPlayer[] = [];
          let currentRank = 1;
          
          sorted.forEach((player, index) => {
            if (index > 0 && player.score === sorted[index - 1].score) {
              ranked.push({ ...player, rank: ranked[index - 1].rank });
            } else {
              currentRank = index + 1;
              ranked.push({ ...player, rank: currentRank });
            }
          });
          
          setPlayers(ranked);
          
          // Check if all players have submitted
          const allSubmitted = allPlayers.length > 0 && allPlayers.every((p: Players) => p.score !== undefined && p.score !== null);
          return allSubmitted;
        } 
        else{
          setPlayers(quizPlayers as RankedPlayer[]);
          return true; // Solo quiz, no need to poll
        }
      } catch (err) {
        console.error("Failed to fetch quiz results:", err);
        return true; // Stop polling on error
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    // For group quizzes, poll every 2 seconds until all players have submitted
    if (participationType === "group") {
      const pollInterval = setInterval(async () => {
        const allSubmitted = await fetchResults();
        if (allSubmitted) {
          clearInterval(pollInterval);
        }
      }, 2000);

      return () => clearInterval(pollInterval);
    }
  }, [quizId, participationType]);

  if (loading || participationType === null) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-2xl">
        Loading results...
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative">
      <Image
        src="/img5.png"
        fill
        style={{ objectFit: "cover" }}
        alt="Quiz Background"
        className="absolute inset-0 -z-10"
      />

      <div className="absolute p-6 rounded-2xl shadow-2xl text-center w-[90%] max-w-3xl">
        <h1 className="text-blue-700 text-5xl font-bold mb-6 animate-pulse">
          🏆 Quiz Results 🏆
        </h1>

        <div className="w-full p-2 bg-cyan-400 opacity-80 rounded-lg shadow-2xl">
          <table className="w-full text-white text-lg">
            <thead>
              <tr className="text-white font-bold text-2xl">
                <th className="py-3 text-center w-1/3">Name</th>
                <th className="py-3 text-center w-1/3">Score</th>
                { participationType == "group" && <th className="py-3 text-center w-1/3">Rank</th> }
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr
                  key={player._id}
                  className={`transition duration-300 ${
                    player.rank === 1
                      ? "bg-cyan-500 font-bold scale-105"
                      : "hover:bg-cyan-500 hover:scale-105"
                  }`}
                >
                  <td className="py-4 px-4 text-center">{player.username}</td>
                  <td className="py-4 px-4 text-center font-mono">{player.score ?? 0}</td>
                  {participationType == "group" && <td className="py-4 px-4 text-center font-mono">{player.rank}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
