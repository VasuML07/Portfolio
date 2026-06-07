"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

const BUILD_AREAS = [
  {
    title: "Machine Learning Systems",
    description: "Neural networks, NLP pipelines, model experimentation, and optimization. Building from first principles to understand what happens beneath the abstraction.",
    items: ["Neural Networks", "NLP Pipelines", "Model Experimentation", "Optimization"],
  },
  {
    title: "Software Products",
    description: "Full-stack applications, REST APIs, and developer tools. Focused on clean architecture, performance, and maintainability.",
    items: ["Full-Stack Applications", "REST APIs", "Developer Tools", "Frontend Engineering"],
  },
  {
    title: "Foundations",
    description: "Data structures, algorithms, and system thinking. The fundamentals that inform every engineering decision.",
    items: ["Data Structures", "Algorithms", "System Thinking", "First Principles"],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="skills" ref={sectionRef} className="py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-foreground/35 tracking-[0.15em] uppercase block mb-3">
            What I Build
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em]">
            Areas of focus
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-6"
        >
          {BUILD_AREAS.map((area) => (
            <motion.div
              key={area.title}
              variants={staggerItem}
              className="group relative p-6 sm:p-8 rounded-2xl border border-border/40 hover:border-border/60 bg-card/30 transition-colors duration-500"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
                <div className="sm:w-64 shrink-0">
                  <h3 className="text-base font-semibold tracking-tight mb-1">
                    {area.title}
                  </h3>
                  <p className="text-sm text-foreground/40 leading-relaxed">
                    {area.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {area.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 text-xs font-mono text-foreground/50 border border-border/30 rounded-full hover:border-border/50 hover:text-foreground/70 transition-colors duration-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
