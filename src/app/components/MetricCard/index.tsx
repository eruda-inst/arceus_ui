"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { hoverAnimation } from "@/utils/animations/hover";

interface MetricCardProps {
  title: string;
  value: string;
  children?: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export function MetricCard({
  title,
  value,
  children,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
}: MetricCardProps) {
  return (
    <motion.li
      className="p-4 flex items-center justify-between bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] rounded-lg shadow-md h-24 border border-[var(--border-light)] dark:border-[var(--border-dark)]"
      {...hoverAnimation}
    >
      <dl className="h-full flex flex-col justify-between w-full">
        <dt className="text-sm text-gray-500 dark:text-gray-400">{title}</dt>
        <dd className="text-2xl font-bold">{value}</dd>
      </dl>
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgColor} ${iconColor}`}
      >
        {children}
      </div>
    </motion.li>
  );
}

MetricCard.displayName = "MetricCard";
