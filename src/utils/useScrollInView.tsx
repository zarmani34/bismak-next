import { useInView } from "react-intersection-observer";

export const useScrollInView = (
  defaultThreshold = 0.2,
  triggerOnce = false
): [(node?: HTMLElement | null) => void, boolean] => {
  const [ref, inView] = useInView({
    threshold: defaultThreshold,
    triggerOnce,
  });

  return [ref, inView];
};
