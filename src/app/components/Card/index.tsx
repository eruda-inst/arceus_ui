import { motion } from "framer-motion";
import { HTMLAttributes, ReactNode } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface CardProps extends HTMLAttributes<HTMLLIElement> {
  children: ReactNode;
}

export function Card({ children, className }: CardProps) {
  const defaultStyle =
    "bg-bg-light rounded-lg shadow-md p-4 flex flex-col gap-y-2 border border-border-light dark:border-border-dark dark:bg-bg-dark";

  return (
    <motion.li
      whileHover={{ y: -2 }}
      transition={{ type: "spring", duration: 0.2 }}
      className={twMerge(defaultStyle, className as ClassNameValue)}
    >
      {children}
    </motion.li>
  );
}

Card.displayName = "Card";
