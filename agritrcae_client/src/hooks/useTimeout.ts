import { useEffect, useRef } from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";


export const useTimeout = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  // remember the last callback if it changes
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // setup the timeout
  useEffect(() => {
    // Dont schedule if no delay is specified
    if (!delay && delay !== 0) {
      return;
    }

    const id = setTimeout(() => savedCallback.current(), delay);

    return clearTimeout(id);
  }, [delay]);
};

export default useTimeout;
