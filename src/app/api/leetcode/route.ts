import { NextResponse } from "next/server";

const LEETCODE_USERNAME = "coder_2028";

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
    }
    contestBadge {
      name
    }
  }
  userContestRanking(username: $username) {
    rating
    globalRanking
  }
  recentAcSubmissionList(username: $username, limit: 10) {
    title
    titleSlug
    timestamp
  }
}
`;

export async function GET() {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://leetcode.com",
        Referer: "https://leetcode.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { username: LEETCODE_USERNAME } }),
      next: { revalidate: 1800 },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error("LeetCode API HTTP error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch LeetCode data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("LeetCode raw response:", JSON.stringify(data)?.slice(0, 500));

    const matchedUser = data.data?.matchedUser;
    const contestRanking = data.data?.userContestRanking;
    const recentSubmissions = data.data?.recentAcSubmissionList;

    if (!matchedUser) {
      return NextResponse.json(
        { error: "User not found on LeetCode" },
        { status: 404 }
      );
    }

    const submissionStats = matchedUser.submitStats.acSubmissionNum;

    const problems = {
      easy: submissionStats.find((s: { difficulty: string }) => s.difficulty === "Easy")?.count || 0,
      medium: submissionStats.find((s: { difficulty: string }) => s.difficulty === "Medium")?.count || 0,
      hard: submissionStats.find((s: { difficulty: string }) => s.difficulty === "Hard")?.count || 0,
      total: submissionStats.reduce((sum: number, s: { count: number }) => sum + s.count, 0),
    };

    return NextResponse.json({
      username: LEETCODE_USERNAME,
      problems,
      ranking: matchedUser.profile?.ranking || 0,
      rating: contestRanking?.rating || 0,
      globalRanking: contestRanking?.globalRanking || 0,
      contestBadge: matchedUser.contestBadge?.name || null,
      recentSubmissions: recentSubmissions || [],
    });
  } catch (error) {
    console.error("LeetCode API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
