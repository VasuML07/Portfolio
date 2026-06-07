"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Navigation from "@/components/portfolio/Navigation";
import Hero from "@/components/portfolio/Hero";
import Highlights from "@/components/portfolio/Highlights";
import Projects from "@/components/portfolio/Projects";
import Skills from "@/components/portfolio/Skills";
import Activity from "@/components/portfolio/Activity";
import About from "@/components/portfolio/About";
import Contact from "@/components/portfolio/Contact";

function PortfolioContent() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Highlights />
      <Projects />
      <Skills />
      <Activity />
      <About />
      <Contact />
    </main>
  );
}

export default function Home() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 30,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <PortfolioContent />
    </QueryClientProvider>
  );
}
