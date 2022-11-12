import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useUIStateStore } from "../pages/_app";
import { useScrambleGen } from "../utils/hooks/useScrambleGen";
import { TimerState, usePuzzleTimer } from "../utils/timer";
import { ConditionallyVisible } from "./ConditionallyVisible";
import { ScrambleDisplay } from "./ScrambleDisplay";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { SlideToggle } from "./SlideToggle";
import { z } from "zod";

export const TimerComponent: React.FC<{ useInspection: boolean }> = ({
  useInspection,
}) => {
  const [ready, setReady] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [currentScramble, nextScramble] = useScrambleGen(10);
  const [time, state, startStop, reset] = usePuzzleTimer(useInspection, 100);

  const [lastTime, setLastTime] = useState<dayjs.Dayjs | null>(null);
  const [bestTime, setBestTime] = useState<dayjs.Dayjs | null>(null);
  const [keyDown, setKeyDown] = useState(false);

  const { data: solveSession, refetch } =
    trpc.solveSession.getCurrentSession.useQuery();

  const router = useRouter();
  const { data: session, status } = useSession();

  const { mutate: addSolve } = trpc.solve.addSolve.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const uiState = useUIStateStore();

  const inspectionToggleRef = useRef<HTMLDivElement>(null);

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
      if (solveSession) {
        addSolve({
          sessionId: solveSession.id,
          time: time.toDate(),
          scramble: currentScramble.join(" "),
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
          uiState.setHidden(true);
          setReadyTimeout(
            setTimeout(() => {
              setReady(true);
              setWaiting(false);
            }, 500)
          );
        } else {
          startStopTimer();
          if (state === TimerState.RUNNING) {
          }
        }
      case "n":
        if (state !== TimerState.STOPPED) {
          return;
        }
        nextScramble();
        break;
      default:
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
      uiState.setHidden(false);
    }
    setKeyDown(false);
  };

  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/");
    }
    window.addEventListener("keydown", handleKeyDown, false);
    window.addEventListener("keyup", handleKeyUp, false);

    enum selectOptions {
      one,
      two,
      three,
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown, false);
      window.removeEventListener("keyup", handleKeyUp, false);
    };
  });

  return (
    <main className="flex flex-col items-center justify-center gap-2 font-mono text-white">
      <ConditionallyVisible visibleOn={!uiState.hidden}>
        <ScrambleDisplay scramble={currentScramble} />
      </ConditionallyVisible>
      <p
        className={`select-none p-0 font-lcd text-8xl tracking-widest md:text-9xl xl:text-[12rem] xl:leading-[12rem] ${
          state === TimerState.INSPECTION || ready ? "text-green-500" : ""
        } ${state === TimerState.STOPPED && waiting ? "text-red-500" : ""}`}
      >
        {state === TimerState.DNF ? (
          <span className="font-mono text-red-500">DNF</span>
        ) : (
          getFormattedTime(time.utc())
        )}
      </p>
    </main>
  );
};
