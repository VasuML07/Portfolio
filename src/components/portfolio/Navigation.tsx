"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { navShrink } from "@/lib/animations";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "What I Build", href: "#skills" },
  { label: "Activity", href: "#activity" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { scrollY, scrollYProgress } = useScroll();

  // Page progress bar width
  const scaleX = useSpring(1, { stiffness: 100, damping: 30, restDelta: 0.001 });
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    scaleX.set(latest > 0.01 ? latest : 0);
  });

  // Scroll detection for nav shrink
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 80);
  });

  // Active section detection via IntersectionObserver
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Force dark theme on first load
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const isDark = resolvedTheme === "dark";

  return (
    <>
      {/* Page scroll progress */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX }}
      />

      <motion.header
        variants={navShrink}
        animate={isScrolled ? "shrunk" : "expanded"}
        className="fixed top-0 left-0 right-0 z-50 pt-5 px-4 sm:px-6"
      >
        <div className="mx-auto max-w-5xl">
          <nav
            className={`flex items-center justify-between rounded-full px-6 transition-all duration-500 ${
              isScrolled
                ? "bg-background/80 backdrop-blur-xl border border-border/50 shadow-sm"
                : "bg-transparent"
            }`}
          >
            {/* Logo */}
            <button
              onClick={() => scrollToSection("#home")}
              className="font-mono text-sm font-medium tracking-tight text-foreground/80 hover:text-foreground transition-colors duration-300"
            >
              AVINASH<span className="text-foreground/40">.</span>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`px-3 py-1.5 text-[13px] transition-colors duration-300 rounded-full ${
                    activeSection === link.href.replace("#", "")
                      ? "text-foreground font-medium"
                      : "text-foreground/50 hover:text-foreground/80"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="h-7 w-7 text-foreground/50 hover:text-foreground/80 rounded-full"
              >
                {isDark ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>

              <div className="md:hidden">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/50 rounded-full">
                      <Menu className="h-3.5 w-3.5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64 bg-background/95 backdrop-blur-xl border-border/30 p-0">
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <div className="flex flex-col p-6 gap-1">
                      <div className="font-mono text-sm font-medium tracking-tight mb-6 text-foreground/80">
                        AVINASH<span className="text-foreground/40">.</span>
                      </div>
                      {NAV_LINKS.map((link, i) => (
                        <motion.button
                          key={link.href}
                          onClick={() => scrollToSection(link.href)}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className={`text-left px-3 py-2.5 text-sm rounded-lg transition-colors ${
                            activeSection === link.href.replace("#", "")
                              ? "text-foreground font-medium bg-foreground/5"
                              : "text-foreground/50 hover:text-foreground/80"
                          }`}
                        >
                          {link.label}
                        </motion.button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </nav>
        </div>
      </motion.header>
    </>
  );
}
