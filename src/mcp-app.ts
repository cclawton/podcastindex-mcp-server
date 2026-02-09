/**
 * PodcastIndex Explorer - MCP App UI Logic
 *
 * Two-mode widget:
 *   1. MCP Apps mode — communicates via App class from @modelcontextprotocol/ext-apps
 *   2. Standalone mode — for mobile WebViews; uses a JS bridge (pushToolResult / onToolCallRequest)
 *
 * Mobile-to-Widget JS API:
 *   window.pushToolResult(json)    — Mobile → Widget: push MCP tool results for display
 *   window._mcpWidgetReady         — Mobile reads: check widget is loaded
 *   window.onToolCallRequest(json) — Widget → Mobile: widget requests a tool call
 */

import { App } from "@modelcontextprotocol/ext-apps";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PodcastRow {
  id: number;
  artwork?: string;
  image?: string;
  title: string;
  author: string;
  language: string;
  episodeCount: number;
  categories: string;
  url?: string;
  link?: string;
}

interface EpisodeRow {
  id: number;
  image?: string;
  feedImage?: string;
  title: string;
  feedTitle: string;
  datePublished: number | string;
  link?: string;
}

interface ToolResultContent {
  type: string;
  text?: string;
}

interface ToolResult {
  content: ToolResultContent[];
}

interface TableData {
  table?: {
    title?: string;
    query?: string;
    columns?: { key: string; label: string; type?: string }[];
    rows?: Record<string, unknown>[];
    totalCount?: number;
  };
  action?: string;
  feeds?: PodcastRow[];
  items?: EpisodeRow[];
  count?: number;
  query?: string;
  error?: boolean;
  message?: string;
}

type SortDirection = "asc" | "desc";

interface TabState {
  data: Record<string, unknown>[];
  filtered: Record<string, unknown>[];
  page: number;
  sortCol: string;
  sortDir: SortDirection;
  filterText: string;
  kind: "podcast" | "episode";
}

// Extend Window for mobile bridge globals
declare global {
  interface Window {
    pushToolResult: (json: string) => void;
    _mcpWidgetReady: boolean;
    onToolCallRequest?: (json: string) => void;
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 25;
const DEBOUNCE_MS = 300;
const CONNECT_TIMEOUT_MS = 1500;

// ─── Formatting Helpers ───────────────────────────────────────────────────────

function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return "";
  const s = String(str);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function formatDate(value: unknown): string {
  if (value === null || value === undefined || value === 0 || value === "") return "";
  let ts: number;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    ts = Number(value);
    if (isNaN(ts)) return String(value);
  } else {
    ts = Number(value);
  }
  if (isNaN(ts) || ts <= 0) return "";
  const d = new Date(ts * 1000);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatCategories(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && !Array.isArray(value)) {
    return Object.values(value as Record<string, string>).join(", ");
  }
  return String(value);
}

const SVG_RSS = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>`;

const SVG_GLOBE = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;

// ─── DOM Helpers ──────────────────────────────────────────────────────────────

function $(id: string): HTMLElement {
  return document.getElementById(id)!;
}

function showLoading(): void {
  $("loading-overlay").classList.add("visible");
}

function hideLoading(): void {
  $("loading-overlay").classList.remove("visible");
}

function showError(msg: string): void {
  $("error-text").textContent = msg;
  $("error-banner").classList.add("visible");
}

function hideError(): void {
  $("error-banner").classList.remove("visible");
}

// ─── State ────────────────────────────────────────────────────────────────────

const tabState: Record<string, TabState> = {
  search: { data: [], filtered: [], page: 0, sortCol: "", sortDir: "asc", filterText: "", kind: "podcast" },
  episodes: { data: [], filtered: [], page: 0, sortCol: "", sortDir: "asc", filterText: "", kind: "episode" },
};

let activeTab = "search";
let standaloneMode = false;

// ─── Column Definitions ──────────────────────────────────────────────────────

interface ColDef {
  key: string;
  label: string;
  render?: (row: Record<string, unknown>) => string;
  cls?: string;
  sortable?: boolean;
}

function renderPodcastLinks(row: Record<string, unknown>): string {
  const parts: string[] = [];
  const feedUrl = row.url ? String(row.url) : "";
  const siteUrl = row.link ? String(row.link) : "";
  if (feedUrl) {
    parts.push(`<a class="action-link" href="${escapeHtml(feedUrl)}" target="_blank" rel="noopener" title="RSS Feed">${SVG_RSS}</a>`);
  }
  if (siteUrl) {
    parts.push(`<a class="action-link" href="${escapeHtml(siteUrl)}" target="_blank" rel="noopener" title="Website">${SVG_GLOBE}</a>`);
  }
  return parts.length ? `<span class="action-links">${parts.join("")}</span>` : "";
}

const podcastCols: ColDef[] = [
  {
    key: "artwork",
    label: "",
    sortable: false,
    render: (row) => {
      const src = escapeHtml(row.artwork || row.image || "");
      if (!src) return "";
      return `<img class="thumb" src="${src}" alt="" loading="lazy" onerror="this.style.display='none'" />`;
    },
  },
  { key: "title", label: "Title", cls: "clickable" },
  {
    key: "url",
    label: "Links",
    sortable: false,
    render: renderPodcastLinks,
  },
  { key: "author", label: "Author" },
  { key: "language", label: "Lang" },
  { key: "episodeCount", label: "Episodes", cls: "number" },
  {
    key: "categories",
    label: "Categories",
    render: (row) => escapeHtml(formatCategories(row.categories)),
  },
];

const episodeCols: ColDef[] = [
  {
    key: "image",
    label: "",
    sortable: false,
    render: (row) => {
      const src = escapeHtml(row.image || row.feedImage || "");
      if (!src) return "";
      return `<img class="thumb" src="${src}" alt="" loading="lazy" onerror="this.style.display='none'" />`;
    },
  },
  {
    key: "title",
    label: "Title",
    render: (row) => {
      const title = escapeHtml(row.title || "");
      const link = row.link ? String(row.link) : "";
      if (link) {
        return `<a href="${escapeHtml(link)}" target="_blank" rel="noopener">${title}</a>`;
      }
      return title;
    },
  },
  { key: "feedTitle", label: "Podcast" },
  {
    key: "datePublished",
    label: "Published",
    render: (row) => escapeHtml(formatDate(row.datePublished)),
  },
];

function colsForKind(kind: string): ColDef[] {
  switch (kind) {
    case "episode":
      return episodeCols;
    default:
      return podcastCols;
  }
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function renderThead(tabId: string): void {
  const state = tabState[tabId];
  const cols = colsForKind(state.kind);
  const thead = $(`thead-${tabId}`) as HTMLTableSectionElement;

  let html = "<tr>";
  for (const col of cols) {
    const isSortable = col.sortable !== false;
    let arrowCls = "";
    if (isSortable && state.sortCol === col.key) {
      arrowCls = state.sortDir;
    }
    html += `<th data-col="${escapeHtml(col.key)}"${isSortable ? "" : ' style="cursor:default"'}>`;
    html += escapeHtml(col.label);
    if (isSortable) {
      html += ` <span class="sort-arrow ${arrowCls}"></span>`;
    }
    html += "</th>";
  }
  html += "</tr>";
  thead.innerHTML = html;
}

function renderTbody(tabId: string): void {
  const state = tabState[tabId];
  const cols = colsForKind(state.kind);
  const tbody = $(`tbody-${tabId}`) as HTMLTableSectionElement;
  const empty = $(`empty-${tabId}`);

  const start = state.page * PAGE_SIZE;
  const pageData = state.filtered.slice(start, start + PAGE_SIZE);

  if (state.filtered.length === 0) {
    tbody.innerHTML = "";
    empty.style.display = "flex";
    if (state.data.length === 0) {
      if (tabId === "search") {
        empty.textContent = "Waiting for results...";
      } else {
        empty.textContent = "Click a podcast title to view its episodes.";
      }
    } else {
      empty.textContent = "No rows match your filter.";
    }
  } else {
    empty.style.display = "none";
    let html = "";
    for (const row of pageData) {
      html += "<tr>";
      for (const col of cols) {
        const classes: string[] = [];
        if (col.cls) classes.push(col.cls);

        if (col.render) {
          html += `<td${classes.length ? ` class="${classes.join(" ")}"` : ""}>${col.render(row)}</td>`;
        } else {
          const val = escapeHtml(row[col.key] ?? "");
          if (col.cls === "clickable" && state.kind === "podcast") {
            html += `<td class="clickable" data-feed-id="${escapeHtml(row.id)}">${val}</td>`;
          } else {
            html += `<td${classes.length ? ` class="${classes.join(" ")}"` : ""}>${val}</td>`;
          }
        }
      }
      html += "</tr>";
    }
    tbody.innerHTML = html;
  }

  const total = state.filtered.length;
  const countEl = $(`count-${tabId}`);
  if (total === 0) {
    countEl.textContent = "";
  } else {
    const from = start + 1;
    const to = Math.min(start + PAGE_SIZE, total);
    countEl.textContent = `Showing ${from}\u2013${to} of ${total}`;
  }

  updatePagination(tabId);
}

function updatePagination(tabId: string): void {
  const state = tabState[tabId];
  const totalPages = Math.max(1, Math.ceil(state.filtered.length / PAGE_SIZE));
  const currentPage = state.page + 1;

  const prevBtn = $(`prev-${tabId}`) as HTMLButtonElement;
  const nextBtn = $(`next-${tabId}`) as HTMLButtonElement;
  const info = $(`pageinfo-${tabId}`);

  prevBtn.disabled = state.page <= 0;
  nextBtn.disabled = currentPage >= totalPages;
  info.textContent = state.filtered.length > 0 ? `Page ${currentPage} of ${totalPages}` : "";
}

function applyFilter(tabId: string): void {
  const state = tabState[tabId];
  const term = state.filterText.toLowerCase();

  if (!term) {
    state.filtered = [...state.data];
  } else {
    state.filtered = state.data.filter((row) => {
      return Object.values(row).some((v) => {
        if (v === null || v === undefined) return false;
        return String(v).toLowerCase().includes(term);
      });
    });
  }

  state.page = 0;
  renderTbody(tabId);
}

function applySort(tabId: string, col: string): void {
  const state = tabState[tabId];

  if (state.sortCol === col) {
    state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
  } else {
    state.sortCol = col;
    state.sortDir = "asc";
  }

  const dir = state.sortDir === "asc" ? 1 : -1;
  state.filtered.sort((a, b) => {
    const va = a[col];
    const vb = b[col];
    if (va === vb) return 0;
    if (va === null || va === undefined) return 1;
    if (vb === null || vb === undefined) return -1;
    if (typeof va === "number" && typeof vb === "number") {
      return (va - vb) * dir;
    }
    return String(va).localeCompare(String(vb)) * dir;
  });

  state.page = 0;
  renderThead(tabId);
  renderTbody(tabId);
}

function switchTab(tabId: string): void {
  activeTab = tabId;

  const buttons = document.querySelectorAll<HTMLButtonElement>(".tab-bar button");
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });

  const containers = document.querySelectorAll<HTMLElement>(".table-container");
  containers.forEach((el) => {
    el.classList.toggle("active", el.id === `tab-${tabId}`);
  });
}

function loadData(tabId: string, rows: Record<string, unknown>[], kind: "podcast" | "episode"): void {
  const state = tabState[tabId];
  state.data = rows;
  state.kind = kind;
  state.page = 0;
  state.sortCol = "";
  state.sortDir = "asc";
  applyFilter(tabId);
  renderThead(tabId);
  renderTbody(tabId);
}

// ─── Result Parsing ───────────────────────────────────────────────────────────

function parseToolResult(result: ToolResult): TableData | null {
  if (!result || !result.content) return null;

  const textContent = result.content.find((c) => c.type === "text");
  if (!textContent || !textContent.text) return null;

  try {
    return JSON.parse(textContent.text) as TableData;
  } catch {
    return null;
  }
}

function extractPodcastRows(data: TableData): Record<string, unknown>[] {
  if (data.table && data.table.rows) {
    return data.table.rows;
  }
  if (data.feeds) {
    return data.feeds as unknown as Record<string, unknown>[];
  }
  return [];
}

function extractEpisodeRows(data: TableData): Record<string, unknown>[] {
  if (data.table && data.table.rows) {
    return data.table.rows;
  }
  if (data.items) {
    return data.items as unknown as Record<string, unknown>[];
  }
  return [];
}

// ─── Shared Result Handler ────────────────────────────────────────────────────

function handleToolResult(result: ToolResult): void {
  const data = parseToolResult(result);
  if (!data) return;

  const action = data.action || "";

  if (action === "search_podcasts" || action === "browse_trending" || (data.feeds && !data.action)) {
    const rows = extractPodcastRows(data);
    loadData("search", rows, "podcast");
    switchTab("search");
  } else if (action === "search_episodes" || (data.items && !data.action)) {
    const rows = extractEpisodeRows(data);
    loadData("episodes", rows, "episode");
    switchTab("episodes");
  } else {
    if (data.table) {
      const rows = data.table.rows || [];
      const hasEpisodeType = data.table.columns?.some((c) => c.key === "episodeType");
      if (hasEpisodeType) {
        loadData("episodes", rows, "episode");
        switchTab("episodes");
      } else {
        loadData("search", rows, "podcast");
        switchTab("search");
      }
    }
  }
}

// ─── Mobile WebView Bridge ────────────────────────────────────────────────────

/**
 * Global function for mobile apps to push MCP tool results into the widget.
 * Call from Android/iOS via evaluateJavascript:
 *   window.pushToolResult(JSON.stringify({content:[{type:"text",text:"..."}]}))
 */
window.pushToolResult = (json: string): void => {
  try {
    const result = JSON.parse(json) as ToolResult;
    handleToolResult(result);
  } catch (err) {
    console.error("pushToolResult: invalid JSON", err);
  }
};

/** Signal that the widget is loaded and ready to receive results. */
window._mcpWidgetReady = true;

// ─── Debounce ─────────────────────────────────────────────────────────────────

function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as unknown as T;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const app = new App({
    name: "PodcastIndex Explorer",
    version: "1.0.0",
  });

  // ── Utility: call a server tool with loading/error handling ──

  async function callTool(
    name: string,
    args: Record<string, unknown>
  ): Promise<TableData | null> {
    showLoading();
    hideError();
    try {
      if (standaloneMode) {
        // In standalone mode, delegate tool calls to the mobile app via JS bridge
        if (window.onToolCallRequest) {
          window.onToolCallRequest(JSON.stringify({ name, arguments: args }));
        } else {
          console.warn("Standalone mode: no onToolCallRequest handler registered");
        }
        return null;
      }

      const result = await app.callServerTool({ name, arguments: args });
      const data = parseToolResult(result as ToolResult);
      if (data && data.error) {
        showError(data.message || "An error occurred.");
        return null;
      }
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showError(`Tool call failed: ${msg}`);
      return null;
    } finally {
      hideLoading();
    }
  }

  // ── Handle tool results from MCP Apps host ──

  app.ontoolresult = (result: unknown) => {
    handleToolResult(result as ToolResult);
  };

  // ── Connect to host (with timeout for standalone mode) ──

  try {
    await Promise.race([
      app.connect(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), CONNECT_TIMEOUT_MS)
      ),
    ]);
    standaloneMode = false;
    console.log("MCP Apps host connected");
  } catch {
    standaloneMode = true;
    console.log("Standalone mode: no MCP Apps host detected, waiting for pushToolResult() calls");
  }

  // ── Wire up UI events ──

  // Error dismiss
  $("error-dismiss").addEventListener("click", hideError);

  // Tabs
  document.querySelectorAll<HTMLButtonElement>(".tab-bar button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    });
  });

  // Podcast title click -> load episodes
  document.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("clickable") && target.dataset.feedId) {
      const feedId = Number(target.dataset.feedId);
      if (isNaN(feedId) || feedId <= 0) return;

      const data = await callTool("episode_get_byfeedid", { id: feedId, max: 50 });
      if (data) {
        const rows = extractEpisodeRows(data);
        loadData("episodes", rows, "episode");
        switchTab("episodes");
      }
    }
  });

  // Filter inputs (debounced)
  for (const tabId of ["search", "episodes"] as const) {
    const filterEl = $(`filter-${tabId}`) as HTMLInputElement;
    filterEl.addEventListener(
      "input",
      debounce(() => {
        tabState[tabId].filterText = filterEl.value.trim();
        applyFilter(tabId);
      }, DEBOUNCE_MS)
    );
  }

  // Column sorting via thead click
  for (const tabId of ["search", "episodes"] as const) {
    const thead = $(`thead-${tabId}`);
    thead.addEventListener("click", (e) => {
      const th = (e.target as HTMLElement).closest("th") as HTMLTableCellElement | null;
      if (!th) return;
      const col = th.dataset.col;
      if (!col) return;
      const cols = colsForKind(tabState[tabId].kind);
      const def = cols.find((c) => c.key === col);
      if (def && def.sortable === false) return;
      applySort(tabId, col);
    });
  }

  // Pagination
  for (const tabId of ["search", "episodes"] as const) {
    $(`prev-${tabId}`).addEventListener("click", () => {
      const state = tabState[tabId];
      if (state.page > 0) {
        state.page--;
        renderTbody(tabId);
      }
    });
    $(`next-${tabId}`).addEventListener("click", () => {
      const state = tabState[tabId];
      const totalPages = Math.ceil(state.filtered.length / PAGE_SIZE);
      if (state.page + 1 < totalPages) {
        state.page++;
        renderTbody(tabId);
      }
    });
  }

}

// Boot
main().catch((err) => {
  console.error("MCP App init error:", err);
  const el = document.getElementById("error-text");
  if (el) {
    el.textContent = `Initialization failed: ${err instanceof Error ? err.message : String(err)}`;
    document.getElementById("error-banner")?.classList.add("visible");
  }
});
