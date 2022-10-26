import { NextPage } from "next";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useScrambleGen } from "../utils/hooks/useScrambleGen";
import { TimerState, usePuzzleTimer } from "../utils/timer";

export const TimerComponent = () => {
  const [currentScramble, nextScramble] = useScrambleGen(10);
  const [time, state, startStop] = usePuzzleTimer();

  const [lastTime, setLastTime] = useState<dayjs.Dayjs | null>(null);
  const [bestTime, setBestTime] = useState<dayjs.Dayjs | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");

  const displayToast = (text: string) => {
    setToastText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const copyScramble = () => {
    displayToast("copied scramble to clipboard!");
    navigator.clipboard.writeText(currentScramble.join(" "));
  };

  const startStopTimer = () => {
    if (state === TimerState.RUNNING) {
      nextScramble();
      setLastTime(time);
      if (!bestTime || time < bestTime) {
        setBestTime(time.utc());
        displayToast("new best time!");
      }
    }
    startStop();
  };

  const getFormattedTime = (time: dayjs.Dayjs) => {
    let formatString = "";
    if (time.utc().hour() >= 1) {
      formatString = "HH:mm:ss.SSS";
    } else {
      if (time.utc().minute() >= 1) {
        formatString = "mm:ss.SSS";
      } else {
        formatString = "ss.SSS";
      }
    }
    return time.utc().format(formatString);
  };

  useEffect(() => {
    window.addEventListener("keypress", startStopTimer, false);
    return () => {
      window.removeEventListener("keypress", startStopTimer, false);
    };
  });

  return (
    <main className="flex flex-grow flex-col items-center justify-center gap-4 overflow-hidden font-mono text-white">
      {showToast && (
        <div className="fixed top-4 z-50 rounded-md border border-green-400 px-4 py-2">
          {toastText}
        </div>
      )}
      <div className="flex select-none gap-1">
        <button
          className="rounded-md bg-zinc-700 px-4 py-2 text-sm lowercase hover:bg-zinc-800 disabled:bg-zinc-900 disabled:text-zinc-700"
          onClick={() => nextScramble()}
          disabled={state != TimerState.STOPPED}
        >
          next scramble
        </button>
      </div>
      <div className="text-md mx-4 grid select-none grid-cols-[repeat(14,_1fr)] items-center justify-center gap-2">
        {currentScramble?.map((s, i) => (
          <span key={`scramble${i}`}>{s}</span>
        ))}
        <button
          title="Copy Scramble"
          onClick={copyScramble}
          className="rounded-md p-1 text-zinc-700 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
      <p
        className={`select-none font-[clock] text-8xl xl:text-9xl ${
          state === TimerState.INSPECTION ? "text-green-500" : ""
        }`}
        onClick={startStopTimer}
      >
        {state === TimerState.DNF ? (
          <span className="font-mono text-red-500">DNF</span>
        ) : (
          getFormattedTime(time.utc())
        )}
      </p>
      <div className=" flex flex-col items-center text-xl">
        <div className="flex items-center gap-2">
          <span>last:</span>
          <span>{lastTime ? getFormattedTime(lastTime.utc()) : "not set"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>best:</span>
          <span>{bestTime ? getFormattedTime(bestTime.utc()) : "not set"}</span>
        </div>
      </div>
    </main>
  );
};
