import { NextResponse } from "next/server";

const LEETCODE_USERNAME = "coder_2028";
const CACHE_DURATION = 1800; // 30 minutes

const QUERY = `
query userProfile($username: String!) {
  matchedUser(username: $username) {
    username
    submitStats {
      acSubmissionNum {
        difficulty
        count
      }
    }
    profile {
      ranking
      userAvatar
      realName
      aboutMe
    }
    contestBadge {
      name
    }
    userCalendar {
      submissionCalendar
    }
  }
  userContestRanking(username: $username) {
    rating
    globalRanking
    attendedContestsCount
    topPercentage
    badge {
      name
    }
  }
}
`;

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

function formatRating(raw: number): number {
  return Math.round(raw);
}

function formatRanking(raw: number): string {
  if (raw <= 0) return "—";
  return `#${raw.toLocaleString("en-US")}`;
}

export async function GET() {
  try {
    const response = await fetchWithTimeout(
      "https://leetcode.com/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://leetcode.com",
          Referer: "https://leetcode.com/",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: QUERY,
          variables: { username: LEETCODE_USERNAME },
        }),
        next: { revalidate: CACHE_DURATION },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch LeetCode data", source: "leetcode" },
        { status: response.status }
      );
    }

    const data = await response.json();

    const matchedUser = data.data?.matchedUser;
    const contestRanking = data.data?.userContestRanking;

    if (!matchedUser) {
      return NextResponse.json(
        { error: "User not found on LeetCode", source: "leetcode" },
        { status: 404 }
      );
    }

    const submissionStats = matchedUser.submitStats.acSubmissionNum;

    const problems = {
      easy: submissionStats.find((s: { difficulty: string }) => s.difficulty === "Easy")?.count || 0,
      medium: submissionStats.find((s: { difficulty: string }) => s.difficulty === "Medium")?.count || 0,
      hard: submissionStats.find((s: { difficulty: string }) => s.difficulty === "Hard")?.count || 0,
      total: submissionStats.find((s: { difficulty: string }) => s.difficulty === "All")?.count || 0,
    };

    // Parse submission calendar for heatmap
    // submissionCalendar is a JSON string: {"1614556800": 3, "1614643200": 1, ...}
    let heatmap: Record<string, number> = {};
    if (matchedUser.userCalendar?.submissionCalendar) {
      try {
        heatmap = JSON.parse(matchedUser.userCalendar.submissionCalendar);
      } catch {
        // If parsing fails, heatmap stays empty — no fake data
      }
    }

    return NextResponse.json({
      username: LEETCODE_USERNAME,
      profile: {
        avatar: matchedUser.profile?.userAvatar || null,
        realName: matchedUser.profile?.realName || null,
        aboutMe: matchedUser.profile?.aboutMe || null,
        profileRanking: matchedUser.profile?.ranking || 0,
      },
      problems,
      contest: {
        rating: contestRanking?.rating ? formatRating(contestRanking.rating) : 0,
        globalRanking: contestRanking?.globalRanking || 0,
        globalRankingFormatted: formatRanking(contestRanking?.globalRanking || 0),
        attendedContestsCount: contestRanking?.attendedContestsCount || 0,
        topPercentage: contestRanking?.topPercentage || 0,
        badge: contestRanking?.badge?.name || matchedUser.contestBadge?.name || null,
      },
      heatmap,
    });
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError"
      ? "LeetCode API request timed out"
      : "Internal server error";
    return NextResponse.json({ error: message, source: "leetcode" }, { status: 500 });
  }
}
