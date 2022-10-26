import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const enum TimerState {
  INSPECTION = "INSPECTION",
  RUNNING = "RUNNING",
  DNF = "DNF",
  STOPPED = "STOPPED",
}

const nextStates: Record<TimerState, TimerState> = {
  [TimerState.INSPECTION]: TimerState.RUNNING,
  [TimerState.RUNNING]: TimerState.STOPPED,
  [TimerState.DNF]: TimerState.INSPECTION,
  [TimerState.STOPPED]: TimerState.INSPECTION,
};

export const usePuzzleTimer = (
  inspectionTime = 15000,
  updateInterval = 10
): [dayjs.Dayjs, TimerState, Function] => {
  const [startTime, setStartTime] = useState(dayjs().utc());
  const [currentTime, setCurrentTime] = useState(
    dayjs(dayjs().utc().diff(dayjs().utc(), "millisecond"))
  );

  const [currentState, setCurrentState] = useState(TimerState.STOPPED);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (
      currentState == TimerState.INSPECTION ||
      currentState == TimerState.RUNNING
    ) {
      interval = setInterval(() => {
        switch (currentState) {
          case TimerState.INSPECTION:
            const diff = startTime.utc().diff(dayjs.utc(), "millisecond");
            if (diff <= 0) {
              setCurrentState(TimerState.DNF);
              setStartTime(dayjs().utc());
              setCurrentTime(
                dayjs(dayjs().utc().diff(dayjs().utc(), "millisecond")).utc()
              );
              clearInterval(interval);
            } else {
              setCurrentTime(dayjs(diff).utc());
            }
            break;
          default:
            setCurrentTime(
              dayjs(dayjs().utc().diff(startTime, "millisecond")).utc()
            );
            break;
        }
      }, updateInterval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [currentState]);

  const startStop = () => {
    switch (currentState) {
      case TimerState.STOPPED:
      case TimerState.DNF:
        setStartTime(dayjs().utc().add(inspectionTime, "millisecond"));
        break;
      case TimerState.INSPECTION:
        setStartTime(dayjs().utc());
      default:
        break;
    }
    setCurrentState((prev) => nextStates[prev]);
  };
  return [currentTime, currentState, startStop];
};
