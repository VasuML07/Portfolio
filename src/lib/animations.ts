import type { Variants } from "framer-motion";

const spring = {
  type: "spring" as const,
  damping: 25,
  stiffness: 120,
};

const smoothSpring = {
  type: "spring" as const,
  damping: 30,
  stiffness: 100,
};

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...smoothSpring, duration: 0.6 },
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...smoothSpring, duration: 0.5 },
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...smoothSpring,
      duration: 0.5,
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...spring, duration: 0.5 },
  },
};

export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...smoothSpring, duration: 0.6 },
  },
};

export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...smoothSpring, duration: 0.6 },
  },
};

export const heroContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export const heroItem: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      ...smoothSpring,
      duration: 0.8,
    },
  },
};

export const cardHover = {
  y: -2,
  transition: { ...spring, duration: 0.3 },
};

export const navShrink = {
  expanded: {
    padding: "1rem 1.5rem",
    transition: { ...smoothSpring, duration: 0.3 },
  },
  shrunk: {
    padding: "0.5rem 1.5rem",
    transition: { ...smoothSpring, duration: 0.3 },
  },
};
