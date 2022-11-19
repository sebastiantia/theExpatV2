import { useState, useEffect } from "react";
interface WindowSize {
  width: number;
  height: number;
}

export const getWindowSizeHook = (): WindowSize => {
  //checking if ssr
  const isServer = typeof window === "undefined";

  const getWindowSize = (): WindowSize => {
    if (isServer) {
      return {
        width: null,
        height: null,
      };
    }
    const { innerWidth: width, innerHeight: height } = window;

    return {
      width,
      height,
    };
  };

  const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize());

  useEffect(() => {
    if (!isServer) {
      window.addEventListener("resize", () => {
        setWindowSize(getWindowSize());
      });
      return (): void =>
        window.removeEventListener("resize", () => {
          setWindowSize(getWindowSize());
        });
    }
  }, [isServer]);

  return windowSize;
};
