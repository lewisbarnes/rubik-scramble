import React, { useEffect, useState } from "react";

export const ConditionallyVisible: React.FC<{
  visibleOn: boolean;
  children?: React.ReactNode;
  className?: string;
}> = ({ visibleOn, children }) => {
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    if (!visibleOn) {
      setAnimation("animate__animated animate__fadeIn animate__fast");
    }
  }, [visibleOn]);

  return (
    <div
      className={`${
        visibleOn
          ? animation
          : "animate__animated animate__fadeOut animate__fast"
      } `}
    >
      {children}
    </div>
  );
};
