"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Define Type for Participants
interface Participant {
  name: string;
  score: number;
  rank: number;
}

// Sample Data (Replace with API data)
const participants: Participant[] = [
  { name: "Alice", score: 95, rank: 1 },
  { name: "Bob", score: 87, rank: 2 },
  { name: "Charlie", score: 75, rank: 3 },
  { name: "Dave", score: 68, rank: 4 },
];

export default function Result() {
  const [sortedParticipants, setSortedParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    // Sort participants by rank in ascending order
    setSortedParticipants([...participants].sort((a, b) => a.rank - b.rank));
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      {/* Heading */}
      <Image 
              src="/img5.png" 
              layout="fill"
              objectFit="cover"
              alt="Quiz Background"
              className="absolute inset-0 -z-10"
            />
      <div className="absolute p-6 rounded-2xl shadow-2xl w-150 text-center">

      <h1 className="text-blue-700 text-5xl md:text-5xl font-bold mb-4 animate-pulse">
      🏆Quiz Results!🏆
      </h1>

      {/* Leaderboard Table */}
      <div className="w-full max-w-2xl p-2 bg-cyan-400 opacity-80 rounded-lg shadow-2xl">
        <table className="w-full text-white text-lg">
          <thead>
            <tr className="text-white font-bold  text-2xl">
              <th className="py-3 text-center w-1/3">Name</th>
              <th className="py-3 text-center w-1/3">Score</th>
              <th className="py-3 text-center w-1/3">Rank</th>
            </tr>
          </thead>
          <tbody>
            {sortedParticipants.map((player, index) => (
              <tr
                key={index}
                className={`text-white font-bold  transition duration-300 ${
                  player.rank === 1
                    ? "bg-cyan-500 font-bold scale-105"
                    : "hover:bg-cyan-500 hover:scale-105"
                }`}
              >
                <td className="py-4 px-4 text-center w-1/3">{player.name}</td>
                <td className="py-4 px-4 text-center w-1/3 font-mono">{player.score}</td>
                <td className="py-4 px-4 text-center w-1/3 font-mono">{player.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
