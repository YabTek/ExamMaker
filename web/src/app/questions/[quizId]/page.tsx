"use client";
import { quizApi } from "@/services/quizApi";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Question {
  question: string;
  choices: string[];
  correct_answer: number;
}

const DEFAULT_DURATION = 300;

export default function Question() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionIdx: number; answerIdx: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION);
  const [startTime] = useState(Date.now());
  const [submitted, setSubmitted] = useState(false);
  const [participationType, setParticipationType] = useState<string | null>(null);
  const { quizId } = useParams() as { quizId: string };
  const router = useRouter();

  useEffect(() => {
    const type = localStorage.getItem("participationType");
    setParticipationType(type);
  }, []);

  const handleFinish = useCallback(async () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      await quizApi.submitQuizAttempt(quizId, answers, timeSpent);
      
      const type = localStorage.getItem("participationType");
      if (type === "solo") {
        router.push(`/result/${quizId}`);
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to submit quiz. Please try again.";
      setError(errorMessage);
      console.error("Quiz submission error:", err);
    }
  }, [answers, quizId, startTime, router]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await quizApi.fetchQuiz(quizId);
        setQuestions(res.data.questions);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to generate questions!";
        setError(errorMessage);
      }
    };
    fetchQuestions();
  }, [quizId]);

  useEffect(() => {
    let cancelled = false;

    const syncTimer = async () => {
      try {
        const res = await quizApi.getTimeLeft(quizId);
        const { timeLeft: serverTimeLeft, started } = res.data;

        if (cancelled) return;

        if (started) {
          setTimeLeft(serverTimeLeft);
        } else {
          await quizApi.startQuiz(quizId);
          const retry = await quizApi.getTimeLeft(quizId);
          if (!cancelled) setTimeLeft(retry.data.timeLeft ?? DEFAULT_DURATION);
        }
      } catch {
        if (!cancelled) setTimeLeft(DEFAULT_DURATION);
      }
    };

    syncTimer();

    const interval = setInterval(syncTimer, 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [quizId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (submitted) {
        router.push(`/result/${quizId}`);
      } else {
        handleFinish();
      }
    }
  }, [timeLeft, submitted, handleFinish, router, quizId]);

  const question_length = questions.length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAnswer = (answerIdx: number) => {
    setAnswers((prev) => {
      const existing = prev.find((q) => q.questionIdx === currentIndex);
      if (existing) {
        return prev.map((q) =>
          q.questionIdx === currentIndex ? { questionIdx: currentIndex, answerIdx } : q
        );
      } else {
        return [...prev, { questionIdx: currentIndex, answerIdx }];
      }
    });
  };

  const handleNext = () => {
    if (currentIndex < question_length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  if (question_length === 0) {
    return <p className="text-white text-center mt-20">Loading questions...</p>;
  }

  // Show waiting screen for group quizzes after submission
  if (submitted && participationType === "group") {
    return (
      <div className="relative w-full h-screen flex flex-col justify-center items-center">
        <Image
          src="/imggg.png"
          fill
          objectFit="cover"
          alt="Quiz Background"
          className="absolute inset-0 -z-10"
        />
        <div className="absolute top-6 left-4 text-xl sm:text-2xl font-bold text-white rounded-xl glow-text">
          Time Left: {formatTime(timeLeft)}
        </div>
        <div className="text-center space-y-6 px-6">
          <div className="text-white text-4xl sm:text-5xl font-extrabold glow animate-pulse">
            ✅ Quiz Submitted!
          </div>
          <p className="text-white text-xl sm:text-2xl font-semibold">
            Waiting for the quiz to end...
          </p>
          <p className="text-white text-lg sm:text-xl opacity-80">
            Results will be shown when the timer reaches zero
          </p>
  
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center">
      <Image
        src="/imggg.png"
        fill
        objectFit="cover"
        alt="Quiz Background"
        className="absolute inset-0 -z-10"
      />
      {error && <p className="text-red-600 text-lg text-center pt-20">{error}</p>}
      <div className="absolute top-6 left-4 text-xl sm:text-2xl font-bold text-white rounded-xl glow-text">
        Time Left: {formatTime(timeLeft)}
      </div>

      <div className="text-center">
        <h1 className="text-white text-3xl sm:text-4xl font-extrabold glow">Questions</h1>
        <p className="text-white sm:text-lg mt-2 px-2 font-bold">
          {currentIndex + 1}. {currentQuestion.question}
        </p>
      </div>

      <div className="mt-4 px-6 space-y-4 w-full max-w-lg">
        {currentQuestion.choices.map((choice, index) => {
          const selected = answers.find((a) => a.questionIdx === currentIndex)?.answerIdx === index;
          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`block w-full py-4 text-white text-lg font-semibold rounded-xl backdrop-blur-md shadow-md transition-all hover:scale-105  ${
                selected ? "bg-pink-500 opacity-70" : "bg-blue-500 opacity-70"
              }`}
            >
              {choice}
            </button>
          );
        })}

        {currentIndex === questions.length - 1 && (
          <div
            onClick={handleFinish}
            className="text-center text-blue-500 opacity-90 text-xl sm:text-2xl font-bold cursor-pointer glow-text"
          >
            Finish Quiz
          </div>
        )}
      </div>

      <div className="absolute top-8 right-8 text-white text-xl sm:text-2xl font-bold cursor-pointer glow-text">
        <Link href="/chooseParticipation">Exit quiz</Link>
      </div>

      {currentIndex < questions.length - 1 && (
        <div
          onClick={handleNext}
          className="absolute bottom-8 right-8 text-white text-xl sm:text-2xl font-bold cursor-pointer glow-text"
        >
          Next...
        </div>
      )}
    </div>
  );
}
