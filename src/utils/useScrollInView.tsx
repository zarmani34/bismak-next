import { useInView } from "react-intersection-observer";
import { TypeScrollInView } from "./types";

export const useScrollInView = (
  defaultThreshold = 0.2,
  triggerOnce = false
): TypeScrollInView => {
  const [ref, inView] = useInView({
    threshold: defaultThreshold,
    triggerOnce,
  });

  return [ref, inView];
};
