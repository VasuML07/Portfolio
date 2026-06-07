"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Github, FileText, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroContainer, heroItem } from "@/lib/animations";

const BADGES = [
  "120+ LeetCode Problems",
  "18 GitHub Repositories",
  "AI/ML Student @ VIT-AP",
  "Built Neural Network Framework From Scratch",
];

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 50, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-40" />

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
        style={{ x: springX, y: springY }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"
        style={{ x: springX, y: springY }}
      />

      {/* Content */}
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 mx-auto max-w-5xl px-6 sm:px-8 text-center"
      >
        {/* Main headline */}
        <motion.div variants={heroItem} className="mb-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            I build{" "}
            <span className="gradient-text">machine learning systems</span>
            <br />
            <span className="text-muted-foreground">and software products.</span>
          </h1>
        </motion.div>

        {/* Secondary statement */}
        <motion.p
          variants={heroItem}
          className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed mb-10"
        >
          Focused on understanding how systems work beneath the abstraction
          layer&nbsp;—&nbsp;from neural networks built with NumPy to
          production-ready applications.
        </motion.p>

        {/* Badges */}
        <motion.div
          variants={heroItem}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {BADGES.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center px-3 py-1.5 text-xs font-mono text-muted-foreground border border-border/50 rounded-full bg-card/50"
            >
              {badge}
            </span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={heroItem}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button variant="outline" size="lg" asChild className="group">
            <a
              href="https://github.com/VasuML07"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
              <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild className="group">
            <a
              href="https://drive.google.com/file/d/146NHCZpQH1My53cRdLK-vGmHOPgu1SyS/view"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText className="mr-2 h-4 w-4" />
              Resume
              <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </Button>
          <Button size="lg" asChild className="group">
            <a href="#contact">
              <Mail className="mr-2 h-4 w-4" />
              Contact
              <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={heroItem}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-border/50 flex items-start justify-center p-1"
          >
            <motion.div className="w-1 h-1.5 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
