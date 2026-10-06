import type { Env } from "./env";
import { Room } from "./room";
import { BANK, type Scenario } from "./stories";
export { Room };

const ROOM_RE = /^[A-Za-z0-9_-]{1,64}$/;
const SCHEMA = [
  "CREATE TABLE IF NOT EXISTS runs (session_id TEXT PRIMARY KEY, player_id TEXT NOT NULL, deck_json TEXT NOT NULL, deck_signature TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0, ending_key TEXT, trust INTEGER, exposure INTEGER, continuity INTEGER, evidence INTEGER)",
  "CREATE TABLE IF NOT EXISTS player_seen (player_id TEXT NOT NULL, scenario_id TEXT NOT NULL, PRIMARY KEY (player_id, scenario_id))",
  "CREATE TABLE IF NOT EXISTS scenario_stats (scenario_id TEXT PRIMARY KEY, times_played INTEGER NOT NULL DEFAULT 0)",
  "CREATE TABLE IF NOT EXISTS choice_events (session_id TEXT NOT NULL, step INTEGER NOT NULL, scenario_id TEXT NOT NULL, choice_index INTEGER NOT NULL, trust INTEGER NOT NULL, exposure INTEGER NOT NULL, continuity INTEGER NOT NULL, evidence INTEGER NOT NULL, PRIMARY KEY (session_id, step))",
  "CREATE INDEX IF NOT EXISTS idx_runs_player ON runs(player_id, created_at)",
];
function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
function randomInt(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max, value = new Uint32Array(1);
  do { crypto.getRandomValues(value); } while (value[0]! >= limit);
  return value[0]! % max;
}
function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}
function buildCard(item: Scenario) {
  const options = shuffle([
    { text: item.a, best: true, band: 0, explanation: item.why },
    { text: item.bad[0] + " The release stays on schedule.", best: false, band: 1, explanation: `This option is non-compliant: “${item.bad[0]}” The applicable standard is: ${item.why}` },
    { text: item.bad[1] + " Support can review edge cases next sprint.", best: false, band: 2, explanation: `This option is non-compliant: “${item.bad[1]}” The applicable standard is: ${item.why}` },
    { text: item.bad[2] + " The launch metrics remain on target.", best: false, band: 3, explanation: `This option is non-compliant: “${item.bad[2]}” The applicable standard is: ${item.why}` },
  ]);
  return { id: item.id, sourceId: item.sourceId, storyId: item.storyId, storyTitle: item.storyTitle, storyPart: item.storyPart,
    tag: item.tag, q: item.q, plot: item.plot, why: item.why, law: item.law,
    options: options.map((o) => ({ text: o.text, band: o.band, explanation: o.explanation })),
    correctIndex: options.findIndex((o) => o.best) };
}
async function ensureSchema(env: Env): Promise<void> {
  for (const sql of SCHEMA) await env.DB.exec(sql);
}
async function createSession(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url), origin = request.headers.get("Origin");
  if (origin && origin !== url.origin) return json({ error: "same-origin requests only" }, 403);
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);
  await ensureSchema(env);
  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 1024) return json({ error: "request too large" }, 413);
    input = JSON.parse(raw);
  } catch { return json({ error: "invalid request" }, 400); }
  if (!input || typeof input !== "object" || Array.isArray(input)) return json({ error: "invalid request" }, 400);
  const body = input as Record<string, unknown>, playerId = body.playerId, sessionId = body.sessionId;
  if (typeof playerId !== "string" || !/^[A-Za-z0-9_-]{8,64}$/.test(playerId)) return json({ error: "invalid investigator id" }, 400);
  if (typeof sessionId !== "string" || !/^[A-Za-z0-9_-]{16,64}$/.test(sessionId)) return json({ error: "invalid case session" }, 400);
  const existing = await env.DB.prepare("SELECT player_id FROM runs WHERE session_id = ?").bind(sessionId).first<{ player_id: string }>();
  if (existing) return existing.player_id === playerId ? json({ sessionId }) : json({ error: "session conflict" }, 409);

  const bankIds = new Set(BANK.map((item) => item.id));
  const history = await env.DB.prepare("SELECT scenario_id FROM player_seen WHERE player_id = ?").bind(playerId).all<{ scenario_id: string }>();
  const seen = new Set(history.results.map((row) => row.scenario_id).filter((id) => bankIds.has(id)));
  if (seen.size >= BANK.length) {
    await env.DB.prepare("DELETE FROM player_seen WHERE player_id = ?").bind(playerId).run();
    seen.clear();
  }
  const rows = await env.DB.prepare("SELECT scenario_id, times_played FROM scenario_stats").all<{ scenario_id: string; times_played: number }>();
  const played = new Map(rows.results.map((row) => [row.scenario_id, row.times_played]));
  const grouped = new Map<string, Scenario[]>();
  for (const item of BANK) grouped.set(item.storyId, [...(grouped.get(item.storyId) ?? []), item]);
  let availableStories = [...grouped.keys()].filter((storyId) => grouped.get(storyId)!.every((item) => !seen.has(item.id)));
  if (availableStories.length < 5) {
    await env.DB.prepare("DELETE FROM player_seen WHERE player_id = ?").bind(playerId).run();
    seen.clear(); availableStories = [...grouped.keys()];
  }
  let deck: ReturnType<typeof buildCard>[] = [], signature = "", unique = false;
  for (let attempt = 0; attempt < 16; attempt++) {
    const tie = new Map(availableStories.map((id) => [id, randomInt(0x7fffffff)]));
    const ranked = [...availableStories].sort((a, b) => {
      const aItems = grouped.get(a)!, bItems = grouped.get(b)!;
      const aPlayed = aItems.reduce((sum, item) => sum + (played.get(item.id) ?? 0), 0);
      const bPlayed = bItems.reduce((sum, item) => sum + (played.get(item.id) ?? 0), 0);
      return aPlayed - bPlayed || tie.get(a)! - tie.get(b)!;
    });
    const order = shuffle(ranked.slice(0, 5));
    deck = order.flatMap((storyId) => [...grouped.get(storyId)!].sort((a, b) => a.storyPart - b.storyPart).map(buildCard));
    signature = deck.map((card) => card.id).sort().join(",");
    const duplicate = await env.DB.prepare("SELECT session_id FROM runs WHERE deck_signature = ?").bind(signature).first();
    if (!duplicate) { unique = true; break; }
  }
  if (!unique) return json({ error: "could not reserve a fresh case set" }, 503);
  const statements = [
    env.DB.prepare("INSERT INTO runs (session_id, player_id, deck_json, deck_signature, created_at) VALUES (?, ?, ?, ?, ?)")
      .bind(sessionId, playerId, JSON.stringify(deck), signature, new Date().toISOString()),
    ...deck.map((card) => env.DB.prepare("INSERT OR IGNORE INTO player_seen (player_id, scenario_id) VALUES (?, ?)").bind(playerId, card.id)),
    ...deck.map((card) => env.DB.prepare("INSERT INTO scenario_stats (scenario_id, times_played) VALUES (?, 1) ON CONFLICT(scenario_id) DO UPDATE SET times_played = times_played + 1").bind(card.id)),
  ];
  await env.DB.batch(statements);
  return json({ sessionId });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/session") return createSession(request, env);
    if (url.pathname === "/ws" || url.pathname.startsWith("/ws/")) {
      if (request.headers.get("Upgrade") !== "websocket") return new Response("expected a websocket upgrade", { status: 426 });
      const raw = url.pathname.slice(3).replace(/^\/+/, ""), room = raw || "main";
      if (!ROOM_RE.test(room)) return new Response("invalid room name", { status: 400 });
      return env.ROOMS.get(env.ROOMS.idFromName(room)).fetch(request);
    }
    if (request.method === "GET" && request.headers.get("Accept")?.includes("text/html")) {
      return env.ASSETS.fetch(new Request(new URL("/", url), request));
    }
    return new Response("not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
