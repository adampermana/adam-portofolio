import { NextResponse } from "next/server";

const GITHUB_USERNAME = "adampermana";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Optional – enables higher rate limits & private contributions

export interface GitHubProfile {
  login: string;
  name: string;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
}

export interface ContributionWeek {
  contributionDays: {
    date: string;
    contributionCount: number;
    contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
  }[];
}

export interface ContributionYear {
  year: number;
  total: number;
  weeks: ContributionWeek[];
}

export interface GitHubData {
  profile: GitHubProfile;
  contributions: ContributionYear[];
  totalContributions: number;
}

const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function fetchProfile(): Promise<GitHubProfile> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}`,
    { headers, next: { revalidate: 3600 } },
  );

  if (!res.ok) {
    throw new Error(`GitHub profile fetch failed: ${res.status}`);
  }

  return res.json();
}

async function fetchContributionsGraphQL(): Promise<ContributionYear[]> {
  if (!GITHUB_TOKEN) return [];

  const now = new Date();
  const currentYear = now.getFullYear();
  const today = now.toISOString().split("T")[0]; // YYYY-MM-DD format
  const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];

  const yearQueries = years
    .map(
      (year) => `
    year${year}: contributionsCollection(
      from: "${year}-01-01T00:00:00Z"
      to: "${year === currentYear ? `${today}T23:59:59Z` : `${year}-12-31T23:59:59Z`}"
    ) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  `,
    )
    .join("\n");

  const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        ${yearQueries}
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const json = await res.json();
  if (json.errors) return [];

  const user = json.data?.user;
  if (!user) return [];

  return years.map((year) => {
    const collection = user[`year${year}`]?.contributionCalendar;
    return {
      year,
      total: collection?.totalContributions ?? 0,
      weeks: (collection?.weeks ?? []) as ContributionWeek[],
    };
  });
}

/**
 * Fallback: use the public github-contributions-api (no token needed).
 * Returns contribution data parsed from the GitHub contribution graph.
 */
async function fetchContributionsFallback(): Promise<ContributionYear[]> {
  const now = new Date();
  const currentYear = now.getFullYear();
  const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];

  const results: ContributionYear[] = [];

  for (const year of years) {
    // Always push the year — even if fetch fails, the year must appear in the filter list.
    let total = 0;
    let weeks: ContributionWeek[] = [];

    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=${year}`,
        { next: { revalidate: 3600 } },
      );

      if (res.ok) {
        const json = await res.json();
        // jogruber API returns { total: { [year]: number }, contributions: [{date, count, level, ...}] }
        let contributions: { date: string; count: number; level: number }[] =
          json.contributions ?? [];

        // Filter contributions to only include dates up to today if it's the current year
        if (year === currentYear) {
          contributions = contributions.filter((day) => day.date <= today);
        }

        total = json.total?.[year] ?? json.total?.[String(year)] ?? 0;

        // Group into weeks (7 days each, starting Sunday)
        let currentWeek: ContributionWeek | null = null;

        for (const day of contributions) {
          const dayOfWeek = new Date(day.date).getDay(); // 0=Sunday
          if (dayOfWeek === 0 || currentWeek === null) {
            if (currentWeek) weeks.push(currentWeek);
            currentWeek = { contributionDays: [] };
          }
          currentWeek.contributionDays.push({
            date: day.date,
            contributionCount: day.count,
            contributionLevel: levelNumberToString(day.level),
          });
        }
        if (currentWeek && currentWeek.contributionDays.length > 0) {
          weeks.push(currentWeek);
        }
      }
    } catch {
      // Fetch failed — year still pushed with empty data below
    }

    results.push({ year, total, weeks });
  }

  return results;
}

function levelNumberToString(
  level: number,
): "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE" {
  const map: Record<
    number,
    "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE"
  > = {
    0: "NONE",
    1: "FIRST_QUARTILE",
    2: "SECOND_QUARTILE",
    3: "THIRD_QUARTILE",
    4: "FOURTH_QUARTILE",
  };
  return map[level] ?? "NONE";
}

export interface NormalizedContributionYear {
  year: number;
  total: number;
  /** Flat list of days in calendar order, ready to render */
  days: { date: string; count: number; level: number }[];
}

function normalizeYears(years: ContributionYear[]): NormalizedContributionYear[] {
  return years.map(({ year, total, weeks }) => ({
    year,
    total,
    days: weeks.flatMap((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: LEVEL_MAP[d.contributionLevel] ?? 0,
      })),
    ),
  }));
}

export async function GET() {
  try {
    const [profile, graphqlContributions] = await Promise.all([
      fetchProfile(),
      fetchContributionsGraphQL(),
    ]);

    let contributions = graphqlContributions;

    // Fall back to public API if no token or GraphQL returned nothing
    if (contributions.length === 0 || contributions.every((y) => y.total === 0)) {
      contributions = await fetchContributionsFallback();
    }

    const normalized = normalizeYears(contributions);
    const totalContributions = normalized.reduce((sum, y) => sum + y.total, 0);

    const data: {
      profile: GitHubProfile;
      contributions: NormalizedContributionYear[];
      totalContributions: number;
    } = {
      profile,
      contributions: normalized,
      totalContributions,
    };

    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (err) {
    console.error("[GitHub API]", err);
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
  }
}
