"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface Project {
  name: string;
  description: string;
  problem: string;
  approach: string;
  implementation: string;
  outcome: string;
  techStack: string[];
  url: string;
}

const PROJECTS: Project[] = [
  {
    name: "Neural Networks From Scratch",
    description:
      "A deep learning framework built entirely with NumPy to understand the internals of neural network training.",
    problem:
      "Most practitioners use high-level frameworks like PyTorch or TensorFlow without understanding what happens under the hood. The goal was to build intuition about how backpropagation, gradient descent, and neural network training actually work at the mathematical level.",
    approach:
      "Started from the fundamentals — implementing dense layers, activation functions (sigmoid, ReLU, softmax), forward propagation, and loss computation. Then built backward propagation using calculus chain rule, implementing gradient computation for each layer type.",
    implementation:
      "Built in pure NumPy with modular architecture supporting arbitrary layer stacking. Implemented SGD and mini-batch gradient descent. Created training loops with epoch tracking and loss monitoring.",
    outcome:
      "Gained deep understanding of gradient flow, vanishing gradients, and the mechanics that power modern deep learning. The framework supports multi-layer networks and can train on standard classification tasks.",
    techStack: ["Python", "NumPy", "Deep Learning", "Mathematics"],
    url: "https://github.com/VasuML07/NeuralNetworkfromscratch",
  },
  {
    name: "Fake Job Prediction System",
    description:
      "An NLP pipeline to identify and classify fraudulent job postings using text preprocessing and ML classification.",
    problem:
      "Fake job postings are a growing problem that costs job seekers time and can expose them to scams. Existing solutions were limited in accuracy and transparency.",
    approach:
      "Built a complete NLP pipeline starting from raw text data. Applied text cleaning, tokenization, and feature extraction using TF-IDF vectorization to convert job descriptions into numerical representations suitable for ML models.",
    implementation:
      "Implemented multiple classification algorithms to compare performance. Used text preprocessing techniques including stopword removal, lemmatization, and feature selection. Built evaluation metrics and cross-validation for robust assessment.",
    outcome:
      "Created a functional classification system that can flag potentially fraudulent job postings. The pipeline is modular and can be extended with more advanced NLP techniques like word embeddings or transformer models.",
    techStack: ["Python", "NLP", "Scikit-learn", "TF-IDF", "Pandas"],
    url: "https://github.com/VasuML07/fakeprediction",
  },
  {
    name: "Weather Application",
    description:
      "A responsive weather dashboard with real-time API integration, focused on clean frontend engineering.",
    problem:
      "Needed a practical project to develop frontend engineering skills — handling async data, managing state, building responsive layouts, and creating good UX.",
    approach:
      "Built a weather application that fetches real-time data from weather APIs. Focused on creating a clean, responsive interface with proper loading states, error handling, and intuitive UX patterns.",
    implementation:
      "Implemented API integration with proper error handling and loading states. Built responsive layouts that work across screen sizes. Applied modern frontend patterns for component composition and state management.",
    outcome:
      "Delivered a fully functional weather dashboard with real-time data, search functionality, and responsive design. The project strengthened frontend engineering fundamentals.",
    techStack: ["JavaScript", "REST APIs", "Responsive Design", "HTML/CSS"],
    url: "https://github.com/VasuML07/weather-app",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={staggerItem}
      layout
      className="group relative rounded-2xl border border-border/50 bg-card/30 hover:border-border transition-all glow-border overflow-hidden"
    >
      <motion.div layout="position" className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="font-mono text-xs text-muted-foreground mb-2 block">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              {project.name}
            </h3>
          </div>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 mt-1 p-2 rounded-lg border border-border/50 hover:border-border transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed mb-6">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-mono text-muted-foreground border border-border/50 rounded-md bg-card/50"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group/expand"
        >
          <span>{expanded ? "Show less" : "Read case study"}</span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
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
                  <h4 className="text-xs font-mono text-emerald-400/80 uppercase tracking-wider mb-2">
                    Problem
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-mono text-emerald-400/80 uppercase tracking-wider mb-2">
                    Approach
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.approach}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-mono text-emerald-400/80 uppercase tracking-wider mb-2">
                    Implementation
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.implementation}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-mono text-emerald-400/80 uppercase tracking-wider mb-2">
                    Outcome
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.outcome}
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
    <section id="projects" ref={sectionRef} className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase block mb-3">
            Projects
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Selected work
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg">
            Projects that represent my approach to engineering — understanding
            systems deeply before building on top of them.
          </p>
        </motion.div>

        {/* Project cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-4"
        >
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
