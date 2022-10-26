import React from "react";

export const ConditionallyVisible: React.FC<{
  visibleOn: boolean;
  children?: React.ReactNode;
  className?: string;
}> = ({ visibleOn, children, className }) => {
  return (
    <div className={visibleOn ? `visible ${className}` : "invisible"}>
      {children}
    </div>
  );
};
