"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface Project {
  number: string;
  name: string;
  tagline: string;
  problem: string;
  approach: string;
  impact: string;
  keyLearning: string;
  techStack: string[];
  url: string;
}

const PROJECTS: Project[] = [
  {
    number: "01",
    name: "Neural Networks From Scratch",
    tagline:
      "A deep learning framework built entirely with NumPy — designed to understand training, optimization, and backpropagation from the ground up.",
    problem:
      "Most machine learning projects rely on frameworks such as TensorFlow or PyTorch, making it difficult to understand how training, optimization, and backpropagation actually work. I wanted to learn what happens inside a neural network rather than simply using existing tools.",
    approach:
      "I designed and implemented a neural network from scratch using only NumPy. The project includes forward propagation, backpropagation, Adam optimizer, training and validation tracking, model persistence, and experiment management. Instead of focusing on benchmark accuracy, the goal was to build a transparent system where every mathematical operation could be inspected and understood.",
    impact:
      "Applied the framework to a real-world fraud detection problem using the Credit Card Fraud Detection dataset containing over 284,000 transactions. Implemented ROC-based threshold tuning and F1-score evaluation to address severe class imbalance. The project provided a practical understanding of optimization, gradient flow, model evaluation, and neural network training mechanics.",
    keyLearning:
      "Understanding the internals of machine learning systems creates stronger engineering intuition than relying solely on frameworks.",
    techStack: ["NumPy", "Python", "Deep Learning", "Machine Learning", "Fraud Detection", "Adam Optimizer"],
    url: "https://github.com/VasuML07/NeuralNetworkfromscratch",
  },
  {
    number: "02",
    name: "Fake Job Prediction System",
    tagline:
      "An end-to-end NLP pipeline that classifies job postings as legitimate or fraudulent using text preprocessing and machine learning.",
    problem:
      "Online job platforms contain fraudulent listings designed to collect personal information or scam applicants. Manually identifying suspicious postings is difficult because fraudulent listings often resemble legitimate opportunities.",
    approach:
      "Built an end-to-end machine learning pipeline that transforms job descriptions into numerical representations using TF-IDF vectorization and classifies them using a trained machine learning model. Pipeline: Text Input → Preprocessing → TF-IDF → Classification → Prediction → Legitimate or Fraudulent",
    impact:
      "Created a complete NLP workflow from data preprocessing to deployment. The project demonstrates practical experience with text preprocessing, feature engineering, TF-IDF vectorization, model training, web deployment, and real-time inference. The system provides immediate classification results for user-submitted job descriptions.",
    keyLearning:
      "In NLP systems, feature engineering and data preparation often contribute more to model quality than the choice of classifier.",
    techStack: ["Python", "Scikit-learn", "TF-IDF", "NLP", "Streamlit", "Machine Learning"],
    url: "https://github.com/VasuML07/fakeprediction",
  },
  {
    number: "03",
    name: "Weather Application",
    tagline:
      "A responsive weather dashboard built with minimal architecture — HTML, CSS, and JavaScript only.",
    problem:
      "Many modern applications depend heavily on frameworks even for simple use cases. I wanted to build a responsive weather application using a minimal architecture while maintaining performance and maintainability.",
    approach:
      "Created a weather dashboard using only HTML, CSS, and JavaScript. The application follows a separation-of-concerns architecture.",
    impact:
      "Built a production-ready frontend application capable of displaying real-time weather data, temperature, humidity, wind speed, weather conditions, and location information. The project demonstrates understanding of asynchronous programming, API integration, browser-side architecture, and responsive interface design.",
    keyLearning:
      "Simple architectures are often easier to maintain, debug, and scale than unnecessarily complex solutions.",
    techStack: ["JavaScript", "HTML", "CSS", "REST APIs", "Weather APIs", "Responsive Design"],
    url: "https://github.com/VasuML07/weather-app",
  },
];

function TerminalMockup({ project }: { project: Project }) {
  return (
    <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/30">
        <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
        <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
        <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
        <span className="ml-2 text-[10px] font-mono text-foreground/25">{project.name.toLowerCase().replace(/\s+/g, "-")}</span>
      </div>
      {/* Terminal body */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-foreground/20">$</span>
          <span className="text-[11px] font-mono text-foreground/35">git clone {project.url.split("github.com/")[1]}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-foreground/20">$</span>
          <span className="text-[11px] font-mono text-foreground/35">cd {project.name.toLowerCase().replace(/\s+/g, "-")}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[10px] font-mono text-foreground/25 border border-border/20 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={staggerItem}
      layout
      className="rounded-2xl border border-border/40 bg-card/30 hover:border-border/60 transition-colors duration-500 overflow-hidden"
    >
      <motion.div layout="position" className="p-6 sm:p-8">
        {/* Top: Number + Title */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4 sm:gap-6">
            <span className="font-mono text-xs text-foreground/25 mt-1 shrink-0">
              {project.number}
            </span>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-[-0.02em]">
                {project.name}
              </h3>
              <p className="text-sm text-foreground/45 leading-relaxed mt-2 max-w-xl">
                {project.tagline}
              </p>
            </div>
          </div>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 mt-1 p-2 rounded-lg border border-border/40 hover:border-border transition-colors text-foreground/30 hover:text-foreground"
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* Visual + Tech row on desktop */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-6 mb-6">
          <TerminalMockup project={project} />
          <div className="flex flex-wrap items-end content-end gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-[11px] font-mono text-foreground/45 border border-border/30 rounded-md hover:border-border/50 hover:text-foreground/60 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Tech stack on mobile */}
        <div className="sm:hidden flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-[11px] font-mono text-foreground/45 border border-border/30 rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-foreground/40 hover:text-foreground/70 transition-colors"
        >
          <span>{expanded ? "Show less" : "Read case study"}</span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.div>
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-6 space-y-6 border-t border-border/30 pt-6">
                <div>
                  <h4 className="text-xs font-mono text-foreground/30 uppercase tracking-[0.12em] mb-2">
                    Problem
                  </h4>
                  <p className="text-sm text-foreground/50 leading-relaxed">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-mono text-foreground/30 uppercase tracking-[0.12em] mb-2">
                    Approach
                  </h4>
                  <p className="text-sm text-foreground/50 leading-relaxed">
                    {project.approach}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-mono text-foreground/30 uppercase tracking-[0.12em] mb-2">
                    Impact
                  </h4>
                  <p className="text-sm text-foreground/50 leading-relaxed">
                    {project.impact}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-mono text-foreground/30 uppercase tracking-[0.12em] mb-2">
                    Key Learning
                  </h4>
                  <p className="text-sm text-foreground/50 leading-relaxed italic">
                    {project.keyLearning}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="projects" ref={sectionRef} className="py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-foreground/35 tracking-[0.15em] uppercase block mb-3">
            Projects
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em]">
            Selected work
          </h2>
          <p className="mt-3 text-foreground/45 max-w-lg">
            Projects that represent my approach to engineering — understanding
            systems deeply before building on top of them.
          </p>
        </motion.div>

        {/* Project cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-5"
        >
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
