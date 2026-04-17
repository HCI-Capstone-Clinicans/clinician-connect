import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ChevronDown, ChevronUp, ExternalLink, Loader2, X } from "lucide-react";
import { Header } from "../components/Header";
import {
  searchOrcid,
  fetchOrcidProfile,
  type OrcidSearchResult,
  type OrcidProfile,
} from "../services/orcidApi";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// Rate-limited batch fetcher: runs `fn` over `items` with at most `concurrency` in-flight at once
async function batchFetch<T>(
  items: string[],
  fn: (id: string) => Promise<T>,
  concurrency: number,
  onResult: (id: string, result: T) => void,
  signal: { cancelled: boolean }
) {
  let i = 0;
  async function next() {
    while (i < items.length) {
      if (signal.cancelled) return;
      const id = items[i++];
      try {
        const result = await fn(id);
        if (!signal.cancelled) onResult(id, result);
      } catch {
        // silently skip failed profile fetches during pre-load
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, next));
}

export default function OrcidSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const [results, setResults] = useState<OrcidSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingNames, setLoadingNames] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Record<string, OrcidProfile>>({});
  const [loadingProfile, setLoadingProfile] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  // Tracks in-progress batch so a new search cancels the previous one
  const batchSignal = useRef<{ cancelled: boolean }>({ cancelled: false });

  // Search + auto-prefetch names whenever debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setProfiles({});
      setSearchError(null);
      setLoadingNames(false);
      return;
    }

    // Cancel any in-flight batch from a previous query
    batchSignal.current.cancelled = true;
    const signal = { cancelled: false };
    batchSignal.current = signal;

    let cancelled = false;
    setSearching(true);
    setLoadingNames(false);
    setSearchError(null);
    setProfiles({});
    setExpandedId(null);

    searchOrcid(debouncedQuery.trim())
      .then((res) => {
        if (cancelled) return;
        setResults(res);
        setSearching(false);

        if (res.length === 0) return;

        // Pre-fetch all profiles in batches of 3 to resolve names upfront
        setLoadingNames(true);
        const ids = res.map((r) => r.orcidId);
        batchFetch(
          ids,
          fetchOrcidProfile,
          3, // max 3 concurrent requests
          (id, profile) => {
            setProfiles((prev) => ({ ...prev, [id]: profile }));
          },
          signal
        ).finally(() => {
          if (!signal.cancelled) setLoadingNames(false);
        });
      })
      .catch((err) => {
        if (!cancelled) {
          setSearchError(err.message ?? "Search failed.");
          setSearching(false);
        }
      });

    return () => {
      cancelled = true;
      signal.cancelled = true;
    };
  }, [debouncedQuery]);

  const toggleExpand = useCallback(
    async (orcidId: string) => {
      if (expandedId === orcidId) {
        setExpandedId(null);
        return;
      }
      setExpandedId(orcidId);
      setProfileError(null);

      if (profiles[orcidId]) return; // already pre-fetched

      setLoadingProfile(orcidId);
      try {
        const profile = await fetchOrcidProfile(orcidId);
        setProfiles((prev) => ({ ...prev, [orcidId]: profile }));
      } catch (err: any) {
        setProfileError(err.message ?? "Failed to load profile.");
      } finally {
        setLoadingProfile(null);
      }
    },
    [expandedId, profiles]
  );

  const clearSearch = () => {
    batchSignal.current.cancelled = true;
    setQuery("");
    setResults([]);
    setProfiles({});
    setExpandedId(null);
    setLoadingNames(false);
    inputRef.current?.focus();
  };

  const resolvedCount = results.filter((r) => profiles[r.orcidId]).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">ORCID Researcher Search</h1>
          <p className="mt-1 text-[13px] text-gray-500">
            Search the public ORCID registry by name, keyword, institution, or ORCID iD.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Jane Smith, cardiology, Johns Hopkins..."
            className="w-full pl-9 pr-9 py-2.5 text-[13px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status line */}
        {searching && (
          <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching…
          </div>
        )}
        {searchError && (
          <p className="text-[13px] text-red-500 mb-4">{searchError}</p>
        )}
        {!searching && !searchError && debouncedQuery && results.length === 0 && (
          <p className="text-[13px] text-gray-500 mb-4">No results found for "{debouncedQuery}".</p>
        )}
        {!searching && results.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <p className="text-[12px] text-gray-400">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {loadingNames && (
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                Resolving names… {resolvedCount}/{results.length}
              </span>
            )}
          </div>
        )}

        {/* Results list */}
        <div className="space-y-2">
          {results.map((r) => {
            const profile = profiles[r.orcidId];
            const isExpanded = expandedId === r.orcidId;
            const isLoadingThis = loadingProfile === r.orcidId;
            const nameResolved = !!profile;
            const displayName = nameResolved
              ? [profile.name.givenNames, profile.name.familyName].filter(Boolean).join(" ") ||
                r.orcidId
              : null;

            return (
              <div
                key={r.orcidId}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Row header */}
                <button
                  onClick={() => toggleExpand(r.orcidId)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      {displayName ? (
                        <>
                          <span className="text-[13px] font-medium text-gray-900 block truncate">
                            {displayName}
                          </span>
                          <span className="text-[11px] text-gray-400">{r.orcidId}</span>
                        </>
                      ) : (
                        <>
                          {/* Skeleton while name is loading */}
                          <span className="inline-block h-3 w-36 bg-gray-100 rounded animate-pulse mb-1" />
                          <span className="text-[11px] text-gray-400 block">{r.orcidId}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {isLoadingThis && <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded profile */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-4 space-y-4">
                    {profileError && !isLoadingThis && (
                      <p className="text-[12px] text-red-500">{profileError}</p>
                    )}
                    {isLoadingThis && (
                      <div className="flex items-center gap-2 text-[12px] text-gray-400">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Loading profile…
                      </div>
                    )}

                    {profile && (
                      <>
                        {/* ORCID link */}
                        <a
                          href={`https://orcid.org/${profile.orcidId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[12px] text-green-700 hover:underline font-medium"
                        >
                          <ExternalLink className="h-3 w-3" />
                          orcid.org/{profile.orcidId}
                        </a>

                        {/* Bio */}
                        {profile.biography && (
                          <Section title="Biography">
                            <p className="text-[12px] text-gray-600 leading-relaxed">
                              {profile.biography}
                            </p>
                          </Section>
                        )}

                        {/* Keywords */}
                        {profile.keywords.length > 0 && (
                          <Section title="Keywords">
                            <div className="flex flex-wrap gap-1.5">
                              {profile.keywords.map((kw) => (
                                <span
                                  key={kw}
                                  className="px-2 py-0.5 text-[11px] bg-gray-100 text-gray-700 rounded-full"
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </Section>
                        )}

                        {/* Affiliations */}
                        {profile.affiliations.length > 0 && (
                          <Section title="Affiliations">
                            <ul className="space-y-1.5">
                              {profile.affiliations.map((a, i) => (
                                <li key={i} className="text-[12px] text-gray-700">
                                  <span className="font-medium">{a.organization}</span>
                                  {a.role && (
                                    <span className="text-gray-500"> — {a.role}</span>
                                  )}
                                  {(a.startYear || a.endYear) && (
                                    <span className="text-gray-400">
                                      {" "}
                                      ({a.startYear ?? "?"}–{a.endYear ?? "present"})
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </Section>
                        )}

                        {/* Works */}
                        {profile.works.length > 0 && (
                          <Section title="Works">
                            <ul className="space-y-2">
                              {profile.works.map((w, i) => (
                                <li key={i} className="text-[12px] text-gray-700">
                                  {w.url ? (
                                    <a
                                      href={w.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-medium text-gray-900 hover:underline"
                                    >
                                      {w.title}
                                    </a>
                                  ) : (
                                    <span className="font-medium">{w.title}</span>
                                  )}
                                  <span className="text-gray-400">
                                    {w.journalTitle ? ` · ${w.journalTitle}` : ""}
                                    {w.year ? ` · ${w.year}` : ""}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </Section>
                        )}

                        {/* Emails */}
                        {profile.emails.length > 0 && (
                          <Section title="Contact">
                            {profile.emails.map((e) => (
                              <a
                                key={e}
                                href={`mailto:${e}`}
                                className="text-[12px] text-blue-600 hover:underline block"
                              >
                                {e}
                              </a>
                            ))}
                          </Section>
                        )}

                        {/* No public data */}
                        {!profile.biography &&
                          profile.keywords.length === 0 &&
                          profile.affiliations.length === 0 &&
                          profile.works.length === 0 && (
                            <p className="text-[12px] text-gray-400 italic">
                              No public information available for this profile.
                            </p>
                          )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
        {title}
      </p>
      {children}
    </div>
  );
}
