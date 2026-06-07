"use client";

import { useRef, useMemo } from "react";
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
  Calendar,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { staggerContainer } from "@/lib/animations";

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
  profile: {
    avatar: string | null;
    realName: string | null;
    aboutMe: string | null;
    profileRanking: number;
  };
  problems: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
  contest: {
    rating: number;
    globalRanking: number;
    globalRankingFormatted: string;
    attendedContestsCount: number;
    topPercentage: number;
    badge: string | null;
  };
  heatmap: Record<string, number>;
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

function DataUnavailable({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="p-3 rounded-xl border border-border/20 bg-card/20 mb-4">
        <AlertCircle className="h-5 w-5 text-foreground/30" />
      </div>
      <p className="text-sm text-foreground/40">{message}</p>
    </motion.div>
  );
}

/* ─── Heatmap Component ─── */
function ContributionHeatmap({ heatmap }: { heatmap: Record<string, number> }) {
  const weeks = useMemo(() => {
    const entries = Object.entries(heatmap);
    if (entries.length === 0) return [];

    const sorted = entries.sort(([a], [b]) => Number(a) - Number(b));
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const oneYearAgoTs = Math.floor(oneYearAgo.getTime() / 1000);

    // Filter to last 52 weeks
    const filtered = sorted.filter(([ts]) => Number(ts) >= oneYearAgoTs);

    // Group by week (7-day chunks starting from oneYearAgo)
    const weekArray: { date: Date; count: number }[][] = [];
    let currentWeek: { date: Date; count: number }[] = [];

    const startDate = new Date(oneYearAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // start on Sunday

    for (let i = 0; i < 53; i++) {
      weekArray.push([]);
    }

    filtered.forEach(([ts, count]) => {
      const date = new Date(Number(ts) * 1000);
      const daysSinceStart = Math.floor(
        (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const weekIndex = Math.floor(daysSinceStart / 7);
      const dayIndex = daysSinceStart % 7;

      if (weekIndex >= 0 && weekIndex < 53 && dayIndex >= 0 && dayIndex < 7) {
        while (weekArray[weekIndex].length <= dayIndex) {
          weekArray[weekIndex].push({ date: new Date(startDate.getTime() + (weekIndex * 7 + weekArray[weekIndex].length) * 24 * 60 * 60 * 1000), count: 0 });
        }
        weekArray[weekIndex][dayIndex] = { date, count };
      }
    });

    // Pad weeks with empty days
    weekArray.forEach((week) => {
      while (week.length < 7) {
        const idx = week.length;
        week.push({
          date: new Date(startDate.getTime() + (weekArray.indexOf(week) * 7 + idx) * 24 * 60 * 60 * 1000),
          count: 0,
        });
      }
    });

    return weekArray;
  }, [heatmap]);

  // Find max count for color scaling
  const maxCount = useMemo(() => {
    return Math.max(1, ...Object.values(heatmap));
  }, [heatmap]);

  const getIntensity = (count: number): string => {
    if (count === 0) return "bg-foreground/[0.04]";
    const ratio = count / maxCount;
    if (ratio <= 0.25) return "bg-foreground/[0.15]";
    if (ratio <= 0.5) return "bg-foreground/[0.3]";
    if (ratio <= 0.75) return "bg-foreground/[0.5]";
    return "bg-foreground/[0.7]";
  };

  // Total submissions in heatmap period
  const totalSubmissions = useMemo(() => {
    return Object.values(heatmap).reduce((sum, count) => sum + count, 0);
  }, [heatmap]);

  if (weeks.length === 0) {
    return null;
  }

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono text-foreground/30 uppercase tracking-[0.12em]">
          Submission Activity
        </h4>
        <span className="text-xs font-mono text-foreground/25">
          {totalSubmissions} submissions in the last year
        </span>
      </div>

      {/* Month labels */}
      <div className="flex gap-0.5 pl-8">
        {weeks.filter((_, i) => i % 4 === 0).map((week, i) => {
          if (week[0]) {
            return (
              <div
                key={`month-${i}`}
                className="text-[8px] font-mono text-foreground/20"
                style={{
                  width: `${(4 * 13 + 3)}px`,
                }}
              >
                {MONTHS[week[0].date.getMonth()]}
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-[3px]" style={{ minWidth: "fit-content" }}>
          {weeks.map((week, weekIdx) => (
            <div key={`week-${weekIdx}`} className="flex flex-col gap-[3px]">
              {week.map((day, dayIdx) => (
                <div
                  key={`day-${weekIdx}-${dayIdx}`}
                  className={`w-[11px] h-[11px] rounded-[2px] transition-colors ${getIntensity(day.count)}`}
                  title={`${day.count} submission${day.count !== 1 ? "s" : ""} on ${day.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-[9px] font-mono text-foreground/20">
        <span>Less</span>
        <div className="w-[11px] h-[11px] rounded-[2px] bg-foreground/[0.04]" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-foreground/[0.15]" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-foreground/[0.3]" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-foreground/[0.5]" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-foreground/[0.7]" />
        <span>More</span>
      </div>
    </div>
  );
}

/* ─── GitHub Section ─── */
function GitHubSection() {
  const { data, isLoading, isError } = useQuery<GitHubData>({
    queryKey: ["github"],
    queryFn: async () => {
      const res = await fetch("/api/github");
      if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
      return res.json();
    },
    staleTime: 1000 * 60 * 30,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
  });

  if (isError) {
    return <DataUnavailable message="Live GitHub data temporarily unavailable." />;
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

/* ─── LeetCode Section ─── */
function LeetCodeSection() {
  const { data, isLoading, isError } = useQuery<LeetCodeData>({
    queryKey: ["leetcode"],
    queryFn: async () => {
      const res = await fetch("/api/leetcode");
      if (!res.ok) throw new Error(`LeetCode API returned ${res.status}`);
      return res.json();
    },
    staleTime: 1000 * 60 * 30,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
  });

  if (isError) {
    return <DataUnavailable message="Live LeetCode data temporarily unavailable. Please check back shortly." />;
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
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-border/30">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl border border-border/30">
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Problem breakdown */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border/30 bg-card/20">
          <div className="text-2xl font-bold">{data.problems.easy}</div>
          <div className="text-xs text-foreground/35 font-mono">Easy</div>
        </div>
        <div className="p-4 rounded-xl border border-border/30 bg-card/20">
          <div className="text-2xl font-bold">{data.problems.medium}</div>
          <div className="text-xs text-foreground/35 font-mono">Medium</div>
        </div>
        <div className="p-4 rounded-xl border border-border/30 bg-card/20">
          <div className="text-2xl font-bold">{data.problems.hard}</div>
          <div className="text-xs text-foreground/35 font-mono">Hard</div>
        </div>
      </div>

      {/* Total Solved + Contest Rating */}
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
              {data.contest.rating > 0 ? data.contest.rating : "—"}
            </span>
          </div>
          <div className="text-xs text-foreground/35 font-mono">
            {data.contest.globalRanking > 0
              ? `${data.contest.globalRankingFormatted} Global`
              : "Contest Rating"}
          </div>
        </div>
      </div>

      {/* Contest info row (only if data available) */}
      {(data.contest.attendedContestsCount > 0 || data.contest.badge) && (
        <div className="grid grid-cols-2 gap-4">
          {data.contest.attendedContestsCount > 0 && (
            <div className="p-4 rounded-xl border border-border/30 bg-card/20">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-foreground/35" />
                <span className="text-xl font-bold">{data.contest.attendedContestsCount}</span>
              </div>
              <div className="text-xs text-foreground/35 font-mono">Contests Attended</div>
            </div>
          )}
          {data.contest.topPercentage > 0 && (
            <div className="p-4 rounded-xl border border-border/30 bg-card/20">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-foreground/35" />
                <span className="text-xl font-bold">Top {data.contest.topPercentage.toFixed(1)}%</span>
              </div>
              <div className="text-xs text-foreground/35 font-mono">Contest Ranking</div>
            </div>
          )}
        </div>
      )}

      {/* Contribution Heatmap (from live submission data) */}
      {Object.keys(data.heatmap).length > 0 && (
        <ContributionHeatmap heatmap={data.heatmap} />
      )}

      {/* Profile link */}
      <div className="pt-4 border-t border-border/20">
        <a
          href="https://leetcode.com/u/coder_2028/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-mono text-foreground/30 hover:text-foreground/50 transition-colors"
        >
          View full profile on LeetCode
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

/* ─── Main Activity Section ─── */
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
            Real-time statistics fetched directly from GitHub and LeetCode.
            Every number shown is verifiable from the source profile.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Tabs defaultValue="leetcode" className="w-full">
            <TabsList className="w-full max-w-xs grid grid-cols-2 mb-6">
              <TabsTrigger value="leetcode" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                LeetCode
              </TabsTrigger>
              <TabsTrigger value="github" className="gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </TabsTrigger>
            </TabsList>
            <TabsContent value="leetcode">
              <LeetCodeSection />
            </TabsContent>
            <TabsContent value="github">
              <GitHubSection />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
