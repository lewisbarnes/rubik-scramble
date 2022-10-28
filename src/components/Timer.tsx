import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useUIStateStore } from "../pages/_app";
import { useScrambleGen } from "../utils/hooks/useScrambleGen";
import { TimerState, usePuzzleTimer } from "../utils/timer";
import { ConditionallyVisible } from "./ConditionallyVisible";
import { ScrambleDisplay } from "./ScrambleDisplay";

export const TimerComponent = () => {
  const [currentScramble, nextScramble] = useScrambleGen(10);
  const [time, state, startStop, reset] = usePuzzleTimer(true, 100);

  const [lastTime, setLastTime] = useState<dayjs.Dayjs | null>(null);
  const [bestTime, setBestTime] = useState<dayjs.Dayjs | null>(null);
  const [keyDown, setKeyDown] = useState(false);

  const [ready, setReady] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const uiState = useUIStateStore();

  const shouldShowUI = useMemo(() => {
    return (
      state === TimerState.STOPPED ||
      (state === TimerState.DNF && !(waiting || ready))
    );
  }, [ready, waiting, state]);

  const [readyTimeout, setReadyTimeout] = useState<NodeJS.Timeout>();

  const startStopTimer = () => {
    if (state === TimerState.RUNNING) {
      nextScramble();
      setLastTime(time);
      uiState.setHidden(false);
      if (!bestTime || time < bestTime) {
        setBestTime(time.utc());
        toast("new best time!", {
          hideProgressBar: true,
        });
      }
    } else {
      uiState.setHidden(true);
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
    return time
      .utc()
      .format(formatString)
      .substring(0, formatString.length - 2);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (keyDown) {
      return;
    }
    switch (e.key) {
      case " ":
        if (state === TimerState.STOPPED) {
          reset();
          setWaiting(true);
          setReadyTimeout(
            setTimeout(() => {
              setReady(true);
              setWaiting(false);
            }, 500)
          );
        } else {
          startStopTimer();
        }
      default:
      case "n":
        if (state !== TimerState.STOPPED) {
          return;
        }
        nextScramble();
        break;
    }
    setKeyDown(true);
  };

  const handleKeyUp = () => {
    if (state == TimerState.STOPPED && ready) {
      startStopTimer();
      setReady(false);
    } else if (waiting) {
      setReady(false);
      setWaiting(false);
      clearTimeout(readyTimeout);
    }
    setKeyDown(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, false);
    window.addEventListener("keyup", handleKeyUp, false);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, false);
      window.removeEventListener("keyup", handleKeyUp, false);
    };
  });

  return (
    <main className="flex flex-grow flex-col items-center justify-center gap-2 font-mono text-white">
      <ConditionallyVisible visibleOn={!uiState.uiHidden}>
        <div className="flex flex-col items-center gap-2">
          <ScrambleDisplay scramble={currentScramble} />
        </div>
      </ConditionallyVisible>

      <p
        className={`select-none p-0 text-8xl md:text-9xl xl:text-[12rem] xl:leading-[12rem] ${
          state === TimerState.INSPECTION || ready ? "text-green-500" : ""
        } ${state === TimerState.STOPPED && waiting ? "text-red-500" : ""}`}
      >
        {state === TimerState.DNF ? (
          <span className="font-mono text-red-500">DNF</span>
        ) : (
          getFormattedTime(time.utc())
        )}
      </p>
      <ConditionallyVisible visibleOn={!uiState.uiHidden}>
        <div className="flex flex-col items-center gap-1 text-xl">
          <div className="flex items-center gap-1 ">
            <span>last:</span>
            <span>
              {lastTime ? getFormattedTime(lastTime.utc()) : "not set"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>best:</span>
            <span>
              {bestTime ? getFormattedTime(bestTime.utc()) : "not set"}
            </span>
          </div>
          <div className="mt-3 w-60 space-y-4 text-center text-sm">
            <p>{"{space} to start/stop timer"}</p>
            <p>{"{n} for next scramble"}</p>
            <p>hold space until timer goes green then release to start</p>
          </div>
        </div>
      </ConditionallyVisible>
    </main>
  );
};
