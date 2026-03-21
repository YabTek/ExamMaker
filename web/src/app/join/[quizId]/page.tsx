"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter, usePathname } from "next/navigation";
import { quizApi } from "@/services/quizApi";
import io, { Socket } from "socket.io-client";

interface User {
  _id: string;
  username: string;
  isHost?: boolean;
}

let socket: Socket;

export default function WaitingRoom() {
  const [players, setPlayers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { quizId } = useParams() as { quizId: string };
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    socket = io(process.env.NEXT_PUBLIC_API_BASE_URL!, {
      transports: ["websocket"],
    });

    socket.emit("join_room", quizId);

    socket.on("player_joined", (updatedPlayers: User[]) => {
      setPlayers(updatedPlayers);
    });

    socket.on("quiz_started", () => {
      router.push(`/generateQuestions/${quizId}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [quizId, router, pathname]);

  useEffect(() => {
    const loadAndJoinQuiz = async () => {
      try {
        const res = await quizApi.fetchQuiz(quizId);
        if (!res) return;

        const joinRes = await quizApi.joinQuiz(quizId);
        const updatedPlayers = joinRes.data.players.filter((p: any) => p.hasJoined);
        setPlayers(updatedPlayers);

        const currUser = joinRes.data.players.find(
          (p: User) => p._id === joinRes.data.currentUser.id
        );
        setCurrentUser(currUser);

        if (joinRes.data.hasStarted) {
          router.push(`/questions/${quizId}`);
          return;
        }

        if (socket?.connected) {
          socket.emit("sync_players", quizId);
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to load quiz";
        setError(errorMessage);
      }
    };

    if (quizId) {
      loadAndJoinQuiz();
    }
  }, [quizId, router]);

  const handleStartQuiz = () => {
    socket.emit("start_quiz", quizId);
    router.push(`/generateQuestions/${quizId}`);
  };

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center text-center">
      <Image
        src="/imggg.png"
        fill
        alt="Waiting room background"
        className="absolute inset-0 object-cover -z-10"
      />

      {error ? (
        <div className="bg-cyan-800/20 rounded-lg p-8 shadow-3xl w-full max-w-md backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            Quiz Unavailable
          </h2>
          <p className="text-lg text-red-700 font-semibold mb-6">
            {error}
          </p>
          <button
            onClick={() => router.push("/chooseParticipation")}
            className="bg-blue-600/80 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:scale-105 transition"
          >
            Go Back
          </button>
        </div>
      ) : (
        <>
          <div className="bg-blue-800/50 rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl text-white font-semibold mb-4">
              Waiting for participants...
            </h2>

            <ul className="space-y-2 ml-4 max-h-64 overflow-y-auto rounded-lg">
              {players.map((player) => (
                <li
                  key={player._id}
                  className="flex justify-between text-white bg-blue-800/70 px-4 py-2 rounded-lg"
                >
                  <span>{player.username}</span>
                  {player.isHost ? (
                    <span className="text-yellow-300 text-sm">Host</span>
                  ) : (
                    <span className="text-yellow-300 text-sm">Joined</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {currentUser?.isHost ? (
            <button
              onClick={handleStartQuiz}
              className="mt-3 bg-blue-700 hover:bg-blue-800 hover:cursor-pointer text-white font-bold py-3 px-6 rounded-lg shadow-md hover:scale-105 transition"
            >
              Start Quiz
            </button>
          ) : (
            <p className="mt-8 text-white text-lg font-semibold bg-black/30 px-6 py-3 rounded-lg backdrop-blur-sm">
              Waiting for host to start the quiz...
            </p>
          )}
        </>
      )}
    </div>
  );
}

