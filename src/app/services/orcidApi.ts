// ORCID Public API service — unauthenticated (public read, CORS-safe)
// The OAuth token endpoint blocks browser CORS requests, so we use the
// public API directly without a token. Public records are fully accessible.

const BASE_URL = "https://pub.orcid.org/v3.0";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const HEADERS = { Accept: "application/json" };

// --- Query result cache (in-memory) ---
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}
const queryCache = new Map<string, CacheEntry<OrcidSearchResult[]>>();
const profileCache = new Map<string, CacheEntry<OrcidProfile>>();

// --- Types ---
export interface OrcidSearchResult {
  orcidId: string;
  relevancyScore: number;
}

export interface OrcidName {
  givenNames: string;
  familyName: string;
}

export interface OrcidAffiliation {
  organization: string;
  role: string;
  startYear: string | null;
  endYear: string | null;
}

export interface OrcidWork {
  title: string;
  type: string;
  year: string | null;
  url: string | null;
  journalTitle: string | null;
}

export interface OrcidProfile {
  orcidId: string;
  name: OrcidName;
  biography: string | null;
  keywords: string[];
  affiliations: OrcidAffiliation[];
  works: OrcidWork[];
  emails: string[];
  externalIds: { type: string; value: string; url: string | null }[];
}

// --- Search ---
export async function searchOrcid(query: string, rows = 20): Promise<OrcidSearchResult[]> {
  const key = `${query}::${rows}`;
  const cached = queryCache.get(key);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  const url = `${BASE_URL}/search/?q=${encodeURIComponent(query)}&rows=${rows}`;
  const res = await fetch(url, { headers: HEADERS });

  if (!res.ok) throw new Error(`ORCID search error: ${res.status}`);
  const data = await res.json();

  const results: OrcidSearchResult[] = (data.result ?? []).map((r: any) => ({
    orcidId: r["orcid-identifier"]?.path ?? "",
    relevancyScore: r["relevancy-score"]?.value ?? 0,
  }));

  queryCache.set(key, { data: results, expiresAt: Date.now() + CACHE_TTL_MS });
  return results;
}

// --- Fetch full profile ---
export async function fetchOrcidProfile(orcidId: string): Promise<OrcidProfile> {
  const cached = profileCache.get(orcidId);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  const res = await fetch(`${BASE_URL}/${orcidId}/record`, { headers: HEADERS });

  if (!res.ok) throw new Error(`ORCID profile error: ${res.status}`);
  const data = await res.json();

  const person = data.person ?? {};
  const givenNames = person?.name?.["given-names"]?.value ?? "";
  const familyName = person?.name?.["family-name"]?.value ?? "";
  const biography = person?.biography?.content ?? null;

  const keywords: string[] = (person?.keywords?.keyword ?? []).map(
    (k: any) => k.content as string
  );

  const emails: string[] = (person?.emails?.email ?? [])
    .filter((e: any) => e.visibility === "public")
    .map((e: any) => e.email as string);

  const externalIds = (person?.["external-identifiers"]?.["external-identifier"] ?? []).map(
    (e: any) => ({
      type: e["external-id-type"] ?? "",
      value: e["external-id-value"] ?? "",
      url: e["external-id-url"]?.value ?? null,
    })
  );

  // Affiliations: employments + educations
  const activities = data["activities-summary"] ?? {};
  const employments = (
    activities?.employments?.["affiliation-group"] ?? []
  ).flatMap((g: any) =>
    (g["summaries"] ?? []).map((s: any) => {
      const sum = s["employment-summary"];
      return {
        organization: sum?.organization?.name ?? "",
        role: sum?.["role-title"] ?? "Employee",
        startYear: sum?.["start-date"]?.year?.value ?? null,
        endYear: sum?.["end-date"]?.year?.value ?? null,
      } as OrcidAffiliation;
    })
  );

  const educations = (
    activities?.educations?.["affiliation-group"] ?? []
  ).flatMap((g: any) =>
    (g["summaries"] ?? []).map((s: any) => {
      const sum = s["education-summary"];
      return {
        organization: sum?.organization?.name ?? "",
        role: sum?.["role-title"] ?? "Student",
        startYear: sum?.["start-date"]?.year?.value ?? null,
        endYear: sum?.["end-date"]?.year?.value ?? null,
      } as OrcidAffiliation;
    })
  );

  // Works (top 10 by display index)
  const works: OrcidWork[] = (activities?.works?.group ?? [])
    .slice(0, 10)
    .map((g: any) => {
      const ws = g["work-summary"]?.[0];
      return {
        title: ws?.title?.title?.value ?? "Untitled",
        type: ws?.type ?? "",
        year: ws?.["publication-date"]?.year?.value ?? null,
        url: ws?.url?.value ?? null,
        journalTitle: ws?.["journal-title"]?.value ?? null,
      } as OrcidWork;
    });

  const profile: OrcidProfile = {
    orcidId,
    name: { givenNames, familyName },
    biography,
    keywords,
    affiliations: [...employments, ...educations],
    works,
    emails,
    externalIds,
  };

  profileCache.set(orcidId, { data: profile, expiresAt: Date.now() + CACHE_TTL_MS });
  return profile;
}
