import React, { useEffect, useState } from "react";

export const ConditionallyVisible: React.FC<{
  visibleOn: boolean;
  children?: React.ReactNode;
  className?: string;
}> = ({ visibleOn, children, className }) => {
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    if (!visibleOn) {
      setAnimation("animate__animated animate__fadeIn animate__fast");
    }
  }, [visibleOn]);

  return (
    <div className={`${!visibleOn ? "invisible" : ""} ${className} contents`}>
      {children}
    </div>
  );
};
