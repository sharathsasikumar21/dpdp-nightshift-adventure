CREATE TABLE IF NOT EXISTS runs (
  session_id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  deck_json TEXT NOT NULL,
  deck_signature TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  ending_key TEXT,
  trust INTEGER,
  exposure INTEGER,
  continuity INTEGER,
  evidence INTEGER
);
CREATE TABLE IF NOT EXISTS player_seen (
  player_id TEXT NOT NULL,
  scenario_id TEXT NOT NULL,
  PRIMARY KEY (player_id, scenario_id)
);
CREATE TABLE IF NOT EXISTS scenario_stats (
  scenario_id TEXT PRIMARY KEY,
  times_played INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS choice_events (
  session_id TEXT NOT NULL,
  step INTEGER NOT NULL,
  scenario_id TEXT NOT NULL,
  choice_index INTEGER NOT NULL,
  trust INTEGER NOT NULL,
  exposure INTEGER NOT NULL,
  continuity INTEGER NOT NULL,
  evidence INTEGER NOT NULL,
  PRIMARY KEY (session_id, step)
);
CREATE INDEX IF NOT EXISTS idx_runs_player ON runs(player_id, created_at);
