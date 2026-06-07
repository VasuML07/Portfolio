import { NextResponse } from "next/server";

const GITHUB_USERNAME = "VasuML07";
const CACHE_DURATION = 1800; // 30 minutes

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  pushed_at: string;
  homepage: string | null;
  fork: boolean;
}

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  bio: string | null;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetchWithTimeout("https://api.github.com/users/VasuML07", {
        next: { revalidate: CACHE_DURATION },
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Avinash-Portfolio/1.0",
        },
      }),
      fetchWithTimeout(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=owner`,
        {
          next: { revalidate: CACHE_DURATION },
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "Avinash-Portfolio/1.0",
          },
        }
      ),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch GitHub data" },
        { status: userRes.status || reposRes.status }
      );
    }

    const userData: GitHubUser = await userRes.json();
    const reposData: GitHubRepo[] = await reposRes.json();

    // Filter out forks
    const repos = reposData.filter((r) => !r.fork);

    // Calculate language breakdown
    const languages: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

    return NextResponse.json({
      user: {
        username: GITHUB_USERNAME,
        avatar: userData.avatar_url,
        bio: userData.bio,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
      },
      repos: repos.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        topics: r.topics,
        updatedAt: r.pushed_at,
        homepage: r.homepage,
      })),
      stats: {
        totalRepos: repos.length,
        totalStars,
        languages,
      },
    });
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError"
      ? "GitHub API request timed out"
      : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
