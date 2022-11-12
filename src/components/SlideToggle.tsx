import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

export const SlideToggle: React.FC<{
  stateVar: boolean;
  stateSet: Dispatch<SetStateAction<boolean>>;
}> = ({ stateVar, stateSet }) => {
  const toggleRef = useRef<HTMLDivElement>(null);
  const toggleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stateVar) {
      toggleContainerRef.current?.classList.add("bg-green-500");
      toggleContainerRef.current?.classList.remove("bg-red-500");
      toggleRef.current?.classList.remove("slide-left");
      toggleRef.current?.classList.add("slide-right");
    } else {
      toggleContainerRef.current?.classList.remove("bg-green-500");
      toggleContainerRef.current?.classList.add("bg-red-500");
      toggleRef.current?.classList.remove("slide-right");
      toggleRef.current?.classList.add("slide-left");
    }
  }, [stateVar]);

  const toggle = () => {
    stateSet((prev) => !prev);
  };

  return (
    <div
      className={`relative flex h-6 w-12 items-center rounded-full bg-red-500`}
      onClick={() => toggle()}
      ref={toggleContainerRef}
    >
      <div
        className={`absolute h-[90%] w-[50%] rounded-full border-2 border-black bg-white`}
        ref={toggleRef}
        title={stateVar ? "enabled" : "disabled"}
      ></div>
    </div>
  );
};
