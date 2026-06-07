"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const paragraphs = [
    {
      text: "Started learning machine learning not just to use frameworks but to understand how they work internally. This led to building a neural network framework from scratch using NumPy — implementing forward propagation, backpropagation, and gradient descent from the ground up.",
    },
    {
      text: "Building a neural network framework from scratch shaped the way I approach engineering problems. It taught me that understanding the fundamentals deeply makes everything built on top of them more reliable and debuggable.",
    },
    {
      text: "Currently studying Artificial Intelligence & Machine Learning at VIT-AP University, I'm interested in machine learning systems, software engineering, optimization, and understanding technology from first principles.",
    },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left column - label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase block mb-3">
              About
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
              The story so far
            </h2>
            <div className="relative">
              {/* Abstract visual element */}
              <div className="w-full aspect-square max-w-[280px] rounded-2xl border border-border/30 bg-card/20 dot-grid overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/40" />
                      </div>
                    </div>
                    {/* Orbital dots */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500/60 animate-float" />
                    <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-500/40 animate-pulse-glow" />
                    <div className="absolute -bottom-4 left-4 w-2.5 h-2.5 rounded-full bg-emerald-400/30" />
                  </div>
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
                className="text-muted-foreground leading-[1.8] text-base"
              >
                {para.text}
              </motion.p>
            ))}

            {/* Additional info */}
            <motion.div
              variants={staggerItem}
              className="pt-6 border-t border-border/30"
            >
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">University</span>
                  <span className="ml-2 font-medium">VIT-AP University</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Specialization</span>
                  <span className="ml-2 font-medium">
                    AI & Machine Learning
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Focus</span>
                  <span className="ml-2 font-medium">
                    ML Systems & Software Engineering
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
