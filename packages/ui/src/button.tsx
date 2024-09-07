"use client";

import { ReactNode } from "react";
import { callHerokuHelloWorld } from "./services/helloWorld.service";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={() => callHerokuHelloWorld(appName)}
    >
      {children}
    </button>
  );
};
