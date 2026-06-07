"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Github, FileText, Mail, ArrowDown } from "lucide-react";
import { heroContainer, heroLine, heroFade } from "@/lib/animations";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse spotlight tracking
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mouseX.set(x);
      mouseY.set(y);
    };
    const container = containerRef.current;
    container?.addEventListener("mousemove", handleMouseMove);
    return () => container?.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const spotlightX = useSpring(mouseX, { damping: 40, stiffness: 80 });
  const spotlightY = useSpring(mouseY, { damping: 40, stiffness: 80 });

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Spotlight layer */}
      <motion.div
        ref={containerRef}
        className="absolute inset-0 spotlight"
        style={
          {
            "--mouse-x": `${spotlightX.get()}%`,
            "--mouse-y": `${spotlightY.get()}%`,
          } as React.CSSProperties
        }
      />

      {/* Content */}
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 mx-auto max-w-4xl px-6 sm:px-8 text-center"
      >
        {/* Tagline */}
        <motion.div variants={heroFade} className="mb-8">
          <span className="inline-block font-mono text-xs tracking-[0.2em] uppercase text-foreground/40">
            Software Engineer &amp; AI/ML
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={heroLine}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[1.1] text-foreground mb-4"
        >
          Understanding before using.
        </motion.h1>

        <motion.h1
          variants={heroLine}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.02em] leading-[1.2] text-foreground/70 mb-10"
        >
          I build machine learning systems,
          <br className="hidden sm:block" />
          developer tools, and software products
          <br className="hidden sm:block" />
          from first principles.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={heroFade}
          className="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-foreground/50 mb-12"
        >
          Most developers start with frameworks.
          <br className="hidden sm:block" />
          I prefer understanding how systems work beneath them.
        </motion.p>

        {/* Expanded subheading - visible on larger screens */}
        <motion.p
          variants={heroFade}
          className="max-w-xl mx-auto text-sm leading-relaxed text-foreground/35 mb-14 hidden md:block"
        >
          From neural networks built with NumPy to real-world software products,
          I enjoy breaking problems down to their fundamentals before building solutions.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={heroFade}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="https://github.com/VasuML07"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full border border-border/60 text-foreground/70 hover:text-foreground hover:border-border transition-all duration-300"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="https://drive.google.com/file/d/146NHCZpQH1My53cRdLK-vGmHOPgu1SyS/view"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full border border-border/60 text-foreground/70 hover:text-foreground hover:border-border transition-all duration-300"
          >
            <FileText className="h-4 w-4" />
            Resume
          </a>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
          >
            <Mail className="h-4 w-4" />
            Contact
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={heroFade}
          className="mt-20 sm:mt-28"
        >
          <motion.a
            href="#highlights"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex flex-col items-center gap-2 text-foreground/25 hover:text-foreground/40 transition-colors"
          >
            <span className="text-[10px] font-mono tracking-[0.15em] uppercase">Scroll</span>
            <ArrowDown className="h-3.5 w-3.5" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
