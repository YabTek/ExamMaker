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

    socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      transports: ["websocket"],
    });

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

        // const quizPlayers: User[] = res.data.players.filter((p: any) => p.hasJoined) || [];
        // setPlayers(quizPlayers);

        // const storedUserId = localStorage.getItem("userId");

        // const alreadyJoined = quizPlayers.some(
        //   (p: User) => p._id === storedUserId
        // );

        // if (!alreadyJoined) {
          const joinRes = await quizApi.joinQuiz(quizId);
          const updatedPlayers = joinRes.data.players.filter((p: any) => p.hasJoined);
          setPlayers(updatedPlayers);

          const currUser = joinRes.data.players.find(
            (p: User) => p._id === joinRes.data.currentUser.id
          );
          setCurrentUser(currUser);
          socket.emit("player_joined", updatedPlayers);
        // } else {
        //   const currUser = quizPlayers.find((p) => p._id === storedUserId) || null;
        //   setCurrentUser(currUser);
        // }
      } catch (err) {
        console.error(err);
        setError("Failed to load quiz");
      }
    };

    if (quizId) {
      loadAndJoinQuiz();
    }
  }, [quizId]);

  const handleStartQuiz = () => {
    socket.emit("start_quiz");
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
        <p className="mt-8 text-black">Waiting for host to start the quiz...</p>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}

