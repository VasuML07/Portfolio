"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface SkillCategory {
  title: string;
  skills: string[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "AI / Machine Learning",
    skills: [
      "Python",
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "TensorFlow",
      "Neural Networks",
      "Deep Learning",
      "NLP",
    ],
  },
  {
    title: "Software Engineering",
    skills: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "REST APIs",
      "Git",
      "Node.js",
    ],
  },
  {
    title: "Data & Tools",
    skills: ["Linux", "Jupyter", "Matplotlib", "SQL", "Tailwind CSS", "Figma"],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="skills" ref={sectionRef} className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase block mb-3">
            Skills & Technologies
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Tools I work with
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg">
            A focused set of technologies that I use to build machine learning
            systems and software products.
          </p>
        </motion.div>

        {/* Skill categories */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {SKILL_CATEGORIES.map((category) => (
            <motion.div key={category.title} variants={staggerItem}>
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <h3 className="text-sm font-semibold tracking-tight">
                    {category.title}
                  </h3>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-3 py-1.5 text-sm font-mono text-muted-foreground border border-border/50 rounded-lg bg-card/30 hover:border-border hover:text-foreground transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
