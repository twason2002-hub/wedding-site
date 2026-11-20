"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { WebsiteRow } from "@/lib/weddings/db";
import type { TemplateDefinition } from "@/lib/weddings/types";
import { formatDate } from "@/lib/weddings/form-utils";
import { isDemoSlug } from "@/lib/weddings/demo";
import { deleteWebsite, setWebsiteStatus } from "@/app/admin/wedding-invitations/actions";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EyeIcon,
  GlobeIcon,
  HourglassIcon,
  LayoutIcon,
  LockIcon,
  PenIcon,
  SearchIcon,
  SparklesIcon,
} from "./AdminIcons";

const STATUS_PILL: Record<WebsiteRow["status"], string> = {
  published: "adm-pill--green",
  draft: "adm-pill--amber",
  expired: "adm-pill--red",
  deleted: "adm-pill--grey",
};

const PAGE_SIZES = [8, 16, 32] as const;
type PageSize = (typeof PAGE_SIZES)[number];
type SortKey = "recent" | "wedding" | "couple" | "expiry";

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400_000);
}

function expand(iso: string | null): number {
  return iso ? new Date(iso).getTime() : Number.POSITIVE_INFINITY;
}

function pageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);
  if (start > 2) items.push("ellipsis");
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < total - 1) items.push("ellipsis");
  items.push(total);
  return items;
}

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const shown = useRef(value);

  useEffect(() => {
    if (shown.current === value) return;
    const from = shown.current;
    const started = performance.now();
    const duration = 620;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const tick = (now: number) => {
      const t = reduce ? 1 : Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - t) ** 3;
      const next = Math.round(from + (value - from) * eased);
      shown.current = next;
      setDisplay(next);
      if (t < 1) raf = requestAnimationFrame(tick);
      else shown.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{display}</>;
}

export default function DashboardClient({
  websites,
  templates,
}: {
  websites: WebsiteRow[];
  templates: TemplateDefinition[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [template, setTemplate] = useState("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(8);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  const stats = useMemo(() => {
    const live = websites.filter((w) => w.status === "published");
    const soon = live.filter((w) => {
      if (w.no_expiry) return false;
      const d = daysUntil(w.expires_at);
      return d !== null && d >= 0 && d <= 7;
    }).length;
    return [
      { key: "sites", label: "Websites", value: websites.length, Icon: GlobeIcon },
      { key: "live", label: "Published", value: live.length, Icon: EyeIcon },
      { key: "demos", label: "Demo sites", value: websites.filter((w) => isDemoSlug(w.slug) || w.no_expiry).length, Icon: SparklesIcon },
      { key: "drafts", label: "Drafts", value: websites.filter((w) => w.status === "draft").length, Icon: PenIcon },
      { key: "expired", label: "Expired", value: websites.filter((w) => w.status === "expired").length, Icon: HourglassIcon },
      { key: "soon", label: "Expiring ≤ 7d", value: soon, Icon: ClockIcon, alert: soon > 0 },
      { key: "templates", label: "Templates", value: templates.length, Icon: LayoutIcon },
    ];
  }, [websites, templates]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return websites.filter((w) => {
      if (status !== "all" && w.status !== status) return false;
      if (template !== "all" && w.templates?.slug !== template) return false;
      if (!q) return true;
      return (
        w.bride_name.toLowerCase().includes(q) ||
        w.groom_name.toLowerCase().includes(q) ||
        w.slug.includes(q)
      );
    });
  }, [websites, query, status, template]);

  const sorted = useMemo(() => {
    const rows = [...filtered];
    switch (sort) {
      case "wedding":
        rows.sort((a, b) => expand(a.wedding_date) - expand(b.wedding_date));
        break;
      case "couple":
        rows.sort((a, b) => `${a.bride_name} ${a.groom_name}`.localeCompare(`${b.bride_name} ${b.groom_name}`));
        break;
      case "expiry":
        rows.sort((a, b) => {
          const ax = a.no_expiry ? Number.POSITIVE_INFINITY : expand(a.expires_at);
          const bx = b.no_expiry ? Number.POSITIVE_INFINITY : expand(b.expires_at);
          return ax - bx;
        });
        break;
      default:
        rows.sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""));
    }
    return rows;
  }, [filtered, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setActionError("");
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setActionError(res.error ?? "Action failed.");
      else router.refresh();
    });
  }

  async function copyLink(w: WebsiteRow) {
    await navigator.clipboard.writeText(`${window.location.origin}/${w.slug}`);
    setCopiedId(w.id);
    setTimeout(() => setCopiedId(null), 1600);
  }

  function goToPage(next: number) {
    const target = Math.min(Math.max(1, next), pageCount);
    setPage(target);
    if (listRef.current) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      listRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }

  function resetPage() {
    setPage(1);
  }

  return (
    <>
      <section aria-label="Overview" className="adm-stats mt-8">
        {stats.map(({ key, label, value, Icon, alert }, i) => (
          <div
            key={key}
            className={`adm-card adm-stat adm-rise${alert ? " adm-stat--alert" : ""}`}
            style={{ animationDelay: `${i * 45}ms` }}
          >
            <span className="adm-stat-icon" aria-hidden="true">
              <Icon size={17} />
            </span>
            <p className="adm-stat-value">
              <CountUp value={value} />
            </p>
            <p className="adm-eyebrow adm-stat-label">{label}</p>
          </div>
        ))}
      </section>

      <section aria-label="All websites" className="mt-12" ref={listRef}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="adm-h2">All websites</h2>
            <p className="adm-hint" style={{ marginTop: 2 }}>
              Demo websites never expire. Client sites go offline after their expiry window.
            </p>
          </div>
          <p className="adm-eyebrow">{sorted.length} of {websites.length}</p>
        </div>

        <div className="adm-toolbar mt-4">
          <div className="adm-search">
            <span className="adm-search-icon" aria-hidden="true"><SearchIcon size={16} /></span>
            <input
              className="adm-field"
              type="search"
              placeholder="Search couple or slug"
              value={query}
              onChange={(e) => { setQuery(e.target.value); resetPage(); }}
              aria-label="Search websites"
            />
          </div>
          <select
            className="adm-field adm-field--auto"
            value={status}
            onChange={(e) => { setStatus(e.target.value); resetPage(); }}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
          </select>
          <select
            className="adm-field adm-field--auto"
            style={{ minWidth: 170 }}
            value={template}
            onChange={(e) => { setTemplate(e.target.value); resetPage(); }}
            aria-label="Filter by template"
          >
            <option value="all">All templates</option>
            {templates.map((t) => (
              <option key={t.slug} value={t.slug}>{t.name}</option>
            ))}
          </select>
          <select
            className="adm-field adm-field--auto"
            style={{ minWidth: 165 }}
            value={sort}
            onChange={(e) => { setSort(e.target.value as SortKey); resetPage(); }}
            aria-label="Sort websites"
          >
            <option value="recent">Recently updated</option>
            <option value="wedding">Wedding date</option>
            <option value="couple">Couple A–Z</option>
            <option value="expiry">Expiry soonest</option>
          </select>
        </div>

        {actionError && <div className="adm-banner adm-banner--err mt-4" role="alert">{actionError}</div>}

        <div className="adm-card mt-4 overflow-x-auto">
          {sorted.length === 0 ? (
            <div className="adm-empty">
              <span className="adm-empty-icon" aria-hidden="true"><GlobeIcon size={26} /></span>
              <p className="adm-h2">No websites found</p>
              <p className="adm-lead mt-2">
                {websites.length === 0
                  ? "Create your first wedding website from a template."
                  : "Try a different search or filter."}
              </p>
              {websites.length === 0 ? (
                <Link href="/admin/wedding-invitations/new" className="adm-btn mt-5">
                  Create website
                </Link>
              ) : (
                <button
                  className="adm-btn adm-btn--outline mt-5"
                  onClick={() => { setQuery(""); setStatus("all"); setTemplate("all"); resetPage(); }}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <table className="adm-table min-w-[900px]">
                <thead>
                  <tr>
                    <th>Couple</th>
                    <th>Template</th>
                    <th>Wedding</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>RSVP</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((w, i) => {
                    const days = daysUntil(w.expires_at);
                    const demo = isDemoSlug(w.slug);
                    return (
                      <tr key={`${w.id}-${currentPage}`} className="adm-row" style={{ animationDelay: `${Math.min(i, 8) * 32}ms` }}>
                        <td>
                          <div className="adm-row-couple">
                            <p className="font-semibold">{w.bride_name} &amp; {w.groom_name}</p>
                            {demo && <span className="adm-pill adm-pill--gold">Demo</span>}
                          </div>
                          <p className="mt-0.5 font-mono text-xs" style={{ color: "var(--adm-faint)" }}>/{w.slug}</p>
                        </td>
                        <td>{w.templates?.name ?? "—"}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{formatDate(w.wedding_date)}</td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {w.no_expiry ? (
                            <span className={`adm-pill ${demo ? "adm-pill--gold" : "adm-pill--blue"}`}>
                              <LockIcon size={11} /> never
                            </span>
                          ) : (
                            <>
                              {formatDate(w.expires_at)}
                              {w.status === "published" && days !== null && days <= 7 && days >= 0 && (
                                <span className="adm-pill adm-pill--amber ml-2">{days}d left</span>
                              )}
                            </>
                          )}
                        </td>
                        <td><span className={`adm-pill ${STATUS_PILL[w.status]}`}>{w.status}</span></td>
                        <td>
                          <Link href={`/admin/wedding-invitations/${w.id}/rsvps`} title="View RSVP responses">
                            <span className={`adm-pill ${w.rsvp_enabled ? "adm-pill--blue" : "adm-pill--grey"}`}>
                              {w.rsvp_enabled ? "on" : "off"}
                            </span>
                          </Link>
                        </td>
                        <td>
                          <div className="adm-row-actions">
                            <Link className="adm-link text-sm" href={`/admin/wedding-invitations/${w.id}/edit`}>Edit</Link>
                            <Link className="adm-link text-sm" href={`/admin/wedding-invitations/${w.id}/rsvps`}>RSVPs</Link>
                            <a className="adm-link text-sm" href={`/${w.slug}`} target="_blank" rel="noreferrer">View</a>
                            <button type="button" className="adm-link adm-link--btn text-sm" onClick={() => copyLink(w)}>
                              {copiedId === w.id ? "Copied ✓" : "Copy link"}
                            </button>
                            {w.status === "published" ? (
                              <button type="button" className="adm-link adm-link--btn text-sm" disabled={pending} onClick={() => run(() => setWebsiteStatus(w.id, "draft"))}>
                                Unpublish
                              </button>
                            ) : w.status === "draft" ? (
                              <button type="button" className="adm-link adm-link--btn text-sm" disabled={pending} onClick={() => run(() => setWebsiteStatus(w.id, "published"))}>
                                Publish
                              </button>
                            ) : null}
                            {confirmDeleteId === w.id ? (
                              <span className="inline-flex items-center gap-2">
                                <button type="button" className="adm-btn adm-btn--danger adm-btn--sm" disabled={pending} onClick={() => { setConfirmDeleteId(null); run(() => deleteWebsite(w.id)); }}>
                                  Confirm delete
                                </button>
                                <button type="button" className="adm-btn adm-btn--outline adm-btn--sm" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                              </span>
                            ) : (
                              <button type="button" className="adm-link adm-link--btn adm-link--danger text-sm" onClick={() => setConfirmDeleteId(w.id)}>
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="adm-pager">
                <p className="adm-pager-meta">
                  Showing <strong>{start + 1}–{Math.min(start + pageSize, sorted.length)}</strong> of <strong>{sorted.length}</strong>
                </p>
                <div className="adm-pager-controls">
                  <button
                    type="button"
                    className="adm-pager-btn"
                    aria-label="Previous page"
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    <ChevronLeftIcon size={16} />
                  </button>
                  {pageItems(currentPage, pageCount).map((item, idx) =>
                    item === "ellipsis" ? (
                      <span key={`gap-${idx}`} className="adm-pager-gap" aria-hidden="true">…</span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        className={`adm-pager-btn${item === currentPage ? " is-active" : ""}`}
                        aria-current={item === currentPage ? "page" : undefined}
                        aria-label={`Page ${item}`}
                        onClick={() => goToPage(item)}
                      >
                        {item}
                      </button>
                    ),
                  )}
                  <button
                    type="button"
                    className="adm-pager-btn"
                    aria-label="Next page"
                    disabled={currentPage === pageCount}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    <ChevronRightIcon size={16} />
                  </button>
                </div>
                <label className="adm-pager-size">
                  <span>Per page</span>
                  <select
                    className="adm-field adm-field--auto"
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value) as PageSize); resetPage(); }}
                  >
                    {PAGE_SIZES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
              </div>
            </>
          )}
        </div>
        <p className="adm-hint mt-3">
          Deleted sites go offline immediately and are purged (including uploaded photos) after the retention window. Demo websites are protected from expiry and purge.
        </p>
      </section>

      <section aria-label="Templates" className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="adm-h2">Templates</h2>
          <p className="adm-eyebrow">Reusable · unlimited websites each</p>
        </div>
        <div className="adm-tpl-grid mt-5">
          {templates.map((t) => (
            <div key={t.slug} className="adm-card adm-card--lift adm-tpl-card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.thumbnail} alt={`${t.name} template preview`} className="adm-tpl-img" loading="lazy" />
              <div className="adm-tpl-body">
                <p className="adm-eyebrow">{t.category}</p>
                <h3 className="adm-tpl-name mt-1">{t.name}</h3>
                <div className="mt-3 flex items-center gap-3">
                  <Link href={`/admin/wedding-invitations/new?template=${t.slug}`} className="adm-link text-sm">Use template</Link>
                  <a href={`/wedding-invitations/templates/${t.slug}`} target="_blank" rel="noreferrer" className="adm-link text-sm">Preview ↗</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
