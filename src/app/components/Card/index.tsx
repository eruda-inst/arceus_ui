import { motion } from "framer-motion";
import { HTMLAttributes, ReactNode } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface CardProps extends HTMLAttributes<HTMLLIElement> {
  children: ReactNode;
}

export function Card({ children, className }: CardProps) {
  const defaultStyle =
    "bg-[var(--bg-light)] rounded-lg shadow-md p-4 flex flex-col gap-y-2 border border-[var(--border-light)] dark:border-[var(--border-dark)] dark:bg-[var(--bg-dark)]";

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
