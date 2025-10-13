import { MotionProps } from "framer-motion";

const hoverAnimation: MotionProps = {
  whileHover: { y: -2 },
  transition: { type: "spring", duration: 0.2 },
};

export { hoverAnimation };
