import type { Variants } from "framer-motion";

// Spring configs
const smoothSpring = {
  type: "spring" as const,
  damping: 35,
  stiffness: 100,
};

const tightSpring = {
  type: "spring" as const,
  damping: 30,
  stiffness: 200,
};

const gentleSpring = {
  type: "spring" as const,
  damping: 40,
  stiffness: 80,
};

// Stagger containers
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export const staggerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    },
  },
};

// Stagger items
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothSpring,
  },
};

export const staggerItemSubtle: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: gentleSpring,
  },
};

// Hero entrance - cinematic reveal
export const heroContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.4,
    },
  },
};

export const heroLine: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    clipPath: "inset(0 0 100% 0)",
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: {
      ...smoothSpring,
      duration: 0.9,
    },
  },
};

export const heroFade: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Section reveals
export const sectionReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothSpring,
  },
};

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothSpring,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Scale animations
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: tightSpring,
  },
};

// Slide animations
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothSpring,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothSpring,
  },
};

// Navigation
export const navShrink = {
  expanded: {
    paddingTop: "1.25rem",
    paddingBottom: "1.25rem",
    transition: { ...smoothSpring, duration: 0.3 },
  },
  shrunk: {
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    transition: { ...smoothSpring, duration: 0.3 },
  },
};

// Card interaction - subtle lift (NOT scaling)
export const cardLift = {
  y: -4,
  transition: tightSpring,
};

// Magnetic button effect config
export const magneticConfig = {
  radius: 100,
  stiffness: 150,
  damping: 15,
  mass: 0.1,
};
