"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const paragraphs = [
    "Most people learn how to use tools. I became interested in understanding how they work.",
    "Building a neural network from scratch taught me that strong engineering comes from understanding fundamentals deeply rather than relying solely on abstractions.",
    "That mindset continues to shape how I approach machine learning, software engineering, and problem solving.",
    "Today, I'm focused on building systems, understanding architecture, and becoming a better engineer one project at a time.",
  ];

  return (
    <section id="about" ref={sectionRef} className="py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left column - label + visual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <span className="font-mono text-xs text-foreground/35 tracking-[0.15em] uppercase block mb-3">
              About
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-8">
              The philosophy behind my work
            </h2>
            <div className="relative">
              {/* Abstract visual element — simple concentric circles */}
              <div className="w-full aspect-square max-w-[280px] rounded-2xl border border-border/30 bg-card/20 overflow-hidden relative flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 rounded-full border border-border/20" />
                  <div className="absolute inset-6 rounded-full border border-border/15" />
                  <div className="absolute inset-12 rounded-full border border-border/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-foreground/10" />
                  </div>
                  {/* Subtle dot markers */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-1.5 h-1.5 rounded-full bg-foreground/15" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-1.5 h-1.5 rounded-full bg-foreground/15" />
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 rounded-full bg-foreground/15" />
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1 w-1.5 h-1.5 rounded-full bg-foreground/15" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column - narrative */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:col-span-3 space-y-6"
          >
            {paragraphs.map((para, index) => (
              <motion.p
                key={index}
                variants={staggerItem}
                className="text-foreground/50 leading-[1.8] text-base"
              >
                {para}
              </motion.p>
            ))}

            {/* Additional info */}
            <motion.div
              variants={staggerItem}
              className="pt-6 border-t border-border/30"
            >
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <div>
                  <span className="text-foreground/35">University</span>
                  <span className="ml-2 font-medium">VIT-AP University</span>
                </div>
                <div>
                  <span className="text-foreground/35">Specialization</span>
                  <span className="ml-2 font-medium">
                    AI &amp; Machine Learning
                  </span>
                </div>
                <div>
                  <span className="text-foreground/35">Focus</span>
                  <span className="ml-2 font-medium">
                    ML Systems &amp; Software Engineering
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
