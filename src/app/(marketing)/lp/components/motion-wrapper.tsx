"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export type AnimationType = "fade-up" | "fade-in" | "fade-left" | "scale-in";

const variantMap: Record<AnimationType, Variants> = {
  "fade-up": fadeUp,
  "fade-in": fadeIn,
  "fade-left": fadeLeft,
  "scale-in": scaleIn,
};

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.5,
  className,
  once = true,
}: ScrollRevealProps) {
  return (
    <motion.div
      variants={variantMap[animation]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
      transition={{ duration, delay, ease: [0, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  animation?: AnimationType;
  duration?: number;
  className?: string;
}

export function StaggerItem({
  children,
  animation = "fade-up",
  duration = 0.5,
  className,
}: StaggerItemProps) {
  return (
    <motion.div
      variants={variantMap[animation]}
      transition={{ duration, ease: [0, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
