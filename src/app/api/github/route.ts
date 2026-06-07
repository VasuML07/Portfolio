import { NextResponse } from "next/server";

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

const GITHUB_USERNAME = "VasuML07";

export async function GET() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/VasuML07", {
        next: { revalidate: 3600 },
        headers: { Accept: "application/vnd.github.v3+json" },
      }),
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=owner`,
        {
          next: { revalidate: 3600 },
          headers: { Accept: "application/vnd.github.v3+json" },
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

    // Filter out forks and get relevant repos
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
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
