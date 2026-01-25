"use client";

import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function Button({ children, className = "", onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className={`px-4 py-2 ${className}`}>
      {children}
    </button>
  );
}
