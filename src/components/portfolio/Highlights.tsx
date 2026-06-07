"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { staggerContainer, staggerItemSubtle } from "@/lib/animations";

interface HighlightCard {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const HIGHLIGHTS: HighlightCard[] = [
  {
    icon: <span className="text-foreground/30">⚡</span>,
    value: "120+",
    label: "LeetCode Problems Solved",
  },
  {
    icon: <span className="text-foreground/30">⎇</span>,
    value: "18",
    label: "GitHub Repositories",
  },
  {
    icon: <span className="text-foreground/30">◆</span>,
    value: "From Scratch",
    label: "Neural Network Built",
  },
  {
    icon: <span className="text-foreground/30">◈</span>,
    value: "AI / ML",
    label: "Student @ VIT-AP University",
  },
];

export default function Highlights() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="highlights" ref={sectionRef} className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="font-mono text-xs text-foreground/35 tracking-[0.15em] uppercase">
            Highlights
          </span>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {HIGHLIGHTS.map((item, index) => (
            <motion.div
              key={index}
              variants={staggerItemSubtle}
              whileHover={{ y: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="group p-6 rounded-2xl border border-border/40 hover:border-border/70 bg-card/30 transition-colors duration-300"
            >
              <div className="mb-4 text-sm">{item.icon}</div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight mb-1">
                {item.value}
              </div>
              <div className="text-sm text-foreground/40 leading-relaxed">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
