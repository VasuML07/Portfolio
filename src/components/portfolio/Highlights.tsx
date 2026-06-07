"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { staggerContainer, staggerItemSubtle } from "@/lib/animations";

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
}

interface LeetCodeStats {
  problems: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
}

// Static items — factual statements, not statistics
const STATIC_ITEMS = [
  {
    value: "From Scratch",
    label: "Neural Network Built",
  },
  {
    value: "AI / ML",
    label: "Student @ VIT-AP University",
  },
];

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function HighlightSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-border/40 bg-card/30">
      <Skeleton className="h-8 w-16 mb-3" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

export default function Highlights() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { data: githubData, isLoading: ghLoading } = useQuery<{
    stats: GitHubStats;
  }>({
    queryKey: ["github-highlights"],
    queryFn: async () => {
      const res = await fetch("/api/github");
      if (!res.ok) throw new Error("Failed to fetch GitHub data");
      return res.json();
    },
    staleTime: 1000 * 60 * 30,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
  });

  const { data: leetcodeData, isLoading: lcLoading } = useQuery<LeetCodeStats>({
    queryKey: ["leetcode-highlights"],
    queryFn: async () => {
      const res = await fetch("/api/leetcode");
      if (!res.ok) throw new Error("Failed to fetch LeetCode data");
      return res.json();
    },
    staleTime: 1000 * 60 * 30,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
  });

  const isLoading = ghLoading || lcLoading;

  // Build dynamic highlight cards from live data
  // Only show a card if the data is actually available
  const dynamicCards: { value: string; label: string }[] = [];

  if (leetcodeData?.problems?.total > 0) {
    dynamicCards.push({
      value: formatNumber(leetcodeData.problems.total),
      label: "LeetCode Problems Solved",
    });
  }

  if (githubData?.stats?.totalRepos > 0) {
    dynamicCards.push({
      value: githubData.stats.totalRepos.toString(),
      label: "GitHub Repositories",
    });
  }

  // If no live data loaded yet, show skeletons for dynamic slots
  const showDynamicSkeletons = isLoading && dynamicCards.length === 0;

  return (
    <section id="highlights" ref={sectionRef} className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="font-mono text-xs text-foreground/35 tracking-[0.15em] uppercase">
            Highlights
          </span>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Dynamic cards from live API data */}
          {showDynamicSkeletons && (
            <>
              <motion.div key="skel-1" variants={staggerItemSubtle}>
                <HighlightSkeleton />
              </motion.div>
              <motion.div key="skel-2" variants={staggerItemSubtle}>
                <HighlightSkeleton />
              </motion.div>
            </>
          )}

          {dynamicCards.map((item, index) => (
            <motion.div
              key={`dynamic-${index}`}
              variants={staggerItemSubtle}
              whileHover={{ y: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="group p-6 rounded-2xl border border-border/40 hover:border-border/70 bg-card/30 transition-colors duration-300"
            >
              <div className="text-3xl sm:text-4xl font-bold tracking-tight mb-1">
                {item.value}
              </div>
              <div className="text-sm text-foreground/40 leading-relaxed">
                {item.label}
              </div>
            </motion.div>
          ))}

          {/* Static items — factual statements, not statistics */}
          {STATIC_ITEMS.map((item, index) => (
            <motion.div
              key={`static-${index}`}
              variants={staggerItemSubtle}
              whileHover={{ y: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="group p-6 rounded-2xl border border-border/40 hover:border-border/70 bg-card/30 transition-colors duration-300"
            >
              <div className="text-3xl sm:text-4xl font-bold tracking-tight mb-1">
                {item.value}
              </div>
              <div className="text-sm text-foreground/40 leading-relaxed">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
