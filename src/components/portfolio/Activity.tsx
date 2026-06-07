"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  Trophy,
  BarChart3,
  Code2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
}

interface GitHubData {
  user: {
    username: string;
    avatar: string;
    bio: string | null;
    publicRepos: number;
    followers: number;
    following: number;
  };
  repos: GitHubRepo[];
  stats: {
    totalRepos: number;
    totalStars: number;
    languages: Record<string, number>;
  };
}

interface LeetCodeData {
  username: string;
  problems: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
  ranking: number;
  rating: number;
  globalRanking: number;
  contestBadge: string | null;
  recentSubmissions: {
    title: string;
    titleSlug: string;
    timestamp: number;
  }[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "text-yellow-400",
  JavaScript: "text-yellow-300",
  TypeScript: "text-blue-400",
  Jupyter: "text-orange-400",
  HTML: "text-orange-500",
  CSS: "text-purple-400",
  "C++": "text-pink-400",
  C: "text-gray-400",
  "C#": "text-green-400",
  Java: "text-red-400",
  Go: "text-cyan-400",
  Rust: "text-orange-600",
  Shell: "text-green-300",
};

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

function GitHubSection() {
  const { data, isLoading, isError } = useQuery<GitHubData>({
    queryKey: ["github"],
    queryFn: async () => {
      const res = await fetch("/api/github");
      if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
      return res.json();
    },
    staleTime: 1000 * 60 * 30,
  });

  // Silently handle error — show minimal note
  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-foreground/25 font-mono">GitHub data temporarily unavailable</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-border/30">
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-border/30">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border/30 bg-card/20">
          <div className="text-2xl font-bold">{data.stats.totalRepos}</div>
          <div className="text-xs text-foreground/35 font-mono">Repositories</div>
        </div>
        <div className="p-4 rounded-xl border border-border/30 bg-card/20">
          <div className="text-2xl font-bold">{data.stats.totalStars}</div>
          <div className="text-xs text-foreground/35 font-mono">
            <Star className="inline h-3 w-3 mr-1" />
            Stars
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border/30 bg-card/20">
          <div className="text-2xl font-bold">{Object.keys(data.stats.languages).length}</div>
          <div className="text-xs text-foreground/35 font-mono">Languages</div>
        </div>
      </div>

      {/* Language distribution */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(data.stats.languages)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 6)
          .map(([lang, count]) => (
            <div
              key={lang}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/30 bg-card/20"
            >
              <div
                className={`w-2 h-2 rounded-full ${LANGUAGE_COLORS[lang] || "bg-foreground/30"}`}
              />
              <span className="text-xs font-mono">{lang}</span>
              <span className="text-xs text-foreground/35">{count}</span>
            </div>
          ))}
      </div>

      {/* Repo list */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {data.repos
          .filter((r) => !r.name.startsWith(".") && r.description)
          .slice(0, 8)
          .map((repo) => (
            <motion.div
              key={repo.id}
              whileHover={{ x: 2 }}
              className="group p-4 rounded-xl border border-border/30 hover:border-border/50 bg-card/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-semibold truncate">
                      {repo.name}
                    </span>
                    {repo.language && (
                      <span className="shrink-0 flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${LANGUAGE_COLORS[repo.language] || "bg-foreground/30"}`}
                        />
                        <span className="text-xs text-foreground/35">
                          {repo.language}
                        </span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/40 line-clamp-2 leading-relaxed">
                    {repo.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-xs text-foreground/35">
                  {(repo.stars > 0 || repo.forks > 0) && (
                    <div className="flex items-center gap-2">
                      {repo.stars > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" /> {repo.stars}
                        </span>
                      )}
                      {repo.forks > 0 && (
                        <span className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" /> {repo.forks}
                        </span>
                      )}
                    </div>
                  )}
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}

function LeetCodeSection() {
  const { data, isLoading, isError } = useQuery<LeetCodeData>({
    queryKey: ["leetcode"],
    queryFn: async () => {
      const res = await fetch("/api/leetcode");
      if (!res.ok) throw new Error(`LeetCode API returned ${res.status}`);
      return res.json();
    },
    staleTime: 1000 * 60 * 30,
  });

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-foreground/25 font-mono">LeetCode data temporarily unavailable</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-border/30">
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-border/30">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border/30 bg-card/20">
          <div className="text-2xl font-bold">
            {data.problems.easy}
          </div>
          <div className="text-xs text-foreground/35 font-mono">Easy</div>
        </div>
        <div className="p-4 rounded-xl border border-border/30 bg-card/20">
          <div className="text-2xl font-bold">
            {data.problems.medium}
          </div>
          <div className="text-xs text-foreground/35 font-mono">Medium</div>
        </div>
        <div className="p-4 rounded-xl border border-border/30 bg-card/20">
          <div className="text-2xl font-bold">
            {data.problems.hard}
          </div>
          <div className="text-xs text-foreground/35 font-mono">Hard</div>
        </div>
      </div>

      {/* Total + Rating */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-border/30 bg-card/20">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-foreground/35" />
            <span className="text-xl font-bold">{data.problems.total}</span>
          </div>
          <div className="text-xs text-foreground/35 font-mono">Total Solved</div>
        </div>
        <div className="p-4 rounded-xl border border-border/30 bg-card/20">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-foreground/35" />
            <span className="text-xl font-bold">
              {data.rating > 0 ? Math.round(data.rating) : "—"}
            </span>
          </div>
          <div className="text-xs text-foreground/35 font-mono">
            {data.globalRanking > 0
              ? `#${data.globalRanking.toLocaleString()} Global`
              : "Contest Rating"}
          </div>
        </div>
      </div>

      {/* Recent submissions */}
      {data.recentSubmissions.length > 0 && (
        <div>
          <h4 className="text-xs font-mono text-foreground/30 uppercase tracking-[0.12em] mb-3">
            Recent Solutions
          </h4>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2">
            {data.recentSubmissions.map((sub, i) => (
              <motion.div
                key={`${sub.titleSlug}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl border border-border/30 bg-card/20"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 w-2 h-2 rounded-full bg-foreground/20" />
                  <span className="text-sm truncate">
                    {sub.title.replace(/[-_]/g, " ")}
                  </span>
                </div>
                <span className="text-xs text-foreground/25 font-mono shrink-0 ml-2">
                  {formatTimeAgo(
                    new Date(sub.timestamp * 1000).toISOString()
                  )}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Activity() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="activity" ref={sectionRef} className="py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-foreground/35 tracking-[0.15em] uppercase block mb-3">
            Activity
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em]">
            Live data dashboard
          </h2>
          <p className="mt-3 text-foreground/45 max-w-lg">
            Live statistics from GitHub and LeetCode.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Tabs defaultValue="github" className="w-full">
            <TabsList className="w-full max-w-xs grid grid-cols-2 mb-6">
              <TabsTrigger value="github" className="gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </TabsTrigger>
              <TabsTrigger value="leetcode" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                LeetCode
              </TabsTrigger>
            </TabsList>
            <TabsContent value="github">
              <GitHubSection />
            </TabsContent>
            <TabsContent value="leetcode">
              <LeetCodeSection />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
