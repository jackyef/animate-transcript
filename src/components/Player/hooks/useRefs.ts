import { createRef, RefObject, useLayoutEffect, useRef } from "react";

export const useRefs = (count: number) => {
  const refs = useRef<RefObject<any>[]>([]);

  useLayoutEffect(() => {
    refs.current = Array(count)
      .fill(null)
      .map((_, i) => refs.current[i] || createRef());
  }, [count]);

  return refs.current;
};
