"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Cpu, GitBranch, GraduationCap } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface HighlightCard {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const HIGHLIGHTS: HighlightCard[] = [
  {
    icon: <Cpu className="h-5 w-5 text-emerald-400" />,
    value: "120+",
    label: "LeetCode Problems Solved",
  },
  {
    icon: <GitBranch className="h-5 w-5 text-emerald-400" />,
    value: "18",
    label: "GitHub Repositories",
  },
  {
    icon: <Brain className="h-5 w-5 text-emerald-400" />,
    value: "From Scratch",
    label: "Neural Network Built",
  },
  {
    icon: <GraduationCap className="h-5 w-5 text-emerald-400" />,
    value: "AI / ML",
    label: "Student @ VIT-AP University",
  },
];

export default function Highlights() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
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
              variants={staggerItem}
              whileHover={{ y: -3, transition: { type: "spring", damping: 20, stiffness: 200 } }}
              className="relative group p-6 rounded-2xl border border-border/50 bg-card/30 hover:border-border transition-colors glow-border"
            >
              <div className="mb-4">{item.icon}</div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight mb-1">
                {item.value}
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
