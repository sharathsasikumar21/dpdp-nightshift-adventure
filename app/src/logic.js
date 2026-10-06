export const meta = { game: "Data Quest: The Consent Protocol", minPlayers: 1, maxPlayers: 1 };

export function setup(players, session) {
  return {
    player: players[0] || "", sessionId: session?.sessionId || "",
    deck: Array.isArray(session?.deck) ? session.deck : [], step: 0,
    trust: 52, exposure: 34, continuity: 68, evidence: 0, score: 0, flags: {}, lastEvent: null, decisionHistory: [],
  };
}

export function validateAction(state, playerId, action) {
  if (!state || typeof state !== "object") return { ok: false, error: "case state unavailable" };
  if (state.player !== playerId) return { ok: false, error: "this case belongs to another investigator" };
  if (state.step >= state.deck.length) return { ok: false, error: "case is already closed" };
  if (!action || typeof action !== "object" || !Number.isInteger(action.choice)) return { ok: false, error: "choose one listed action" };
  const current = state.deck[state.step];
  if (!current || action.choice < 0 || action.choice >= current.options.length) return { ok: false, error: "that action is outside this decision" };
  return { ok: true };
}

const clamp = (n) => Math.max(0, Math.min(100, n));
function levelFor(score) {
  if (score >= 1350) return "Privacy Sentinel";
  if (score >= 1050) return "Trust Strategist";
  if (score >= 750) return "Incident Operator";
  if (score >= 400) return "Consent Scout";
  return "Policy Intern";
}
function ending(s) {
  if (s.exposure <= 24 && s.trust >= 62 && s.evidence >= 36) return { key: "clean", title: "The Signal Holds", detail: "The incident is contained, the record is defensible, and the team trusts the process. The company gives up a little speed and keeps its credibility." };
  if (s.exposure >= 72) return { key: "breach", title: "The Board Is Calling", detail: "A preventable exposure reaches the response threshold. Containment starts late, and earlier shortcuts now have an audit trail." };
  if (s.trust < 34) return { key: "trust", title: "Nobody Signs the Memo", detail: "The legal position may be repairable, but people no longer trust the privacy function enough to surface problems early." };
  if (s.continuity < 28) return { key: "shutdown", title: "Service Freeze", detail: "Safeguards improved, but operations were interrupted sharply enough that the launch is suspended pending recovery." };
  if (s.evidence >= 42 && s.exposure < 48) return { key: "audit", title: "A Defensible Record", detail: "The response is not spotless, but the evidence is strong enough to explain the decisions and the fixes." };
  return { key: "narrow", title: "A Narrow Escape", detail: "The service stays online. Several tradeoffs remain open, and the next review will decide whether this becomes a mature privacy program." };
}
function echoFor(s, current) {
  const source = current.sourceId;
  let callback = "";
  if (s.flags.vendor && source === "breachnotice") callback = "Your processor contract gives the response team a named escalation contact.";
  else if (s.flags.youth && ["rights", "requestchannel"].includes(source)) callback = "The guardian channel you protected earlier now has a clear route to act.";
  else if (s.flags.audit && source === "retention") callback = "Your evidence trail identifies which copy can be erased and which record must be retained.";
  else if (s.flags.fragile && source === "security") callback = "The team hesitates to share the incident log; an earlier shortcut weakened confidence in the record.";
  else if (s.step === 5) callback = "A second signal lands. The regulator clock appears on the console.";
  else if (s.step === 10) callback = "The launch team asks for one final exception. Your earlier calls are changing who will back you.";
  return (current.plot || "A new signal lands in the case queue. This decision will alter what the team can do next.") + (callback ? " " + callback : "");
}

export function applyAction(state, playerId, action) {
  const current = state.deck[state.step], picked = current.options[action.choice], sound = picked.band === 0;
  let trust = sound ? 7 : picked.band === 1 ? -2 : -5;
  let exposure = sound ? -8 : picked.band === 1 ? 6 : 10;
  let continuity = sound ? -3 : picked.band === 1 ? 5 : 2;
  let evidence = sound ? 5 : picked.band === 1 ? 1 : -2;
  const source = current.sourceId || current.id;
  if (["breach", "security"].includes(source)) exposure += sound ? -4 : 4;
  if (["child", "childconsent"].includes(source)) trust += sound ? 3 : -2;
  const points = sound ? 100 : picked.band === 1 ? 55 : picked.band === 2 ? 25 : 0;
  const score = (Number.isFinite(state.score) ? state.score : 0) + points;
  const event = {
      step: state.step, scenarioId: current.id, storyTitle: current.storyTitle, choice: action.choice, choiceText: picked.text,
      outcome: sound ? "clean" : picked.band === 1 ? "mixed" : "bad",
      points, score, level: levelFor(score), explanation: picked.explanation || current.why,
      consequence: sound ? "The team accepts the slower, documented route. Exposure falls and the audit trail gains a usable record."
        : picked.band === 1 ? "The compromise preserves launch capacity for now, but leaves a gap the next reviewer may challenge."
        : "The fast path buys a few minutes. A downstream team inherits unresolved risk, and the evidence gets thinner.",
      trust: clamp(state.trust + trust), exposure: clamp(state.exposure + exposure),
      continuity: clamp(state.continuity + continuity), evidence: clamp(state.evidence + evidence), why: current.why, law: current.law,
  };
  return {
    ...state, step: state.step + 1, trust: clamp(state.trust + trust), exposure: clamp(state.exposure + exposure),
    continuity: clamp(state.continuity + continuity), evidence: clamp(state.evidence + evidence), score,
    flags: { ...state.flags,
      vendor: state.flags.vendor || (["processor", "securityvendor"].includes(source) && sound),
      youth: state.flags.youth || (["child", "childconsent"].includes(source) && sound),
      audit: state.flags.audit || (["consentproof", "accuracy"].includes(source) && sound),
      fragile: state.flags.fragile || (!sound && ["breach", "security"].includes(source)) },
    lastEvent: event, decisionHistory: [...(state.decisionHistory || []), event],
  };
}

export function isGameOver(state) {
  if (state.step < state.deck.length) return { over: false };
  return { over: true, ...ending(state), trust: state.trust, exposure: state.exposure, continuity: state.continuity, evidence: state.evidence, score: state.score, level: levelFor(state.score) };
}
export function viewFor(state, playerId) {
  if (state.player !== playerId) return { denied: true };
  const current = state.deck[state.step] || null;
  return {
    sessionId: state.sessionId, step: state.step, total: state.deck.length,
    trust: state.trust, exposure: state.exposure, continuity: state.continuity, evidence: state.evidence, score: state.score, level: levelFor(state.score),
    current: current ? { id: current.id, sourceId: current.sourceId, storyId: current.storyId, storyTitle: current.storyTitle, storyPart: current.storyPart, tag: current.tag, q: current.q, options: current.options.map((o) => o.text), echo: echoFor(state, current) } : null,
    lastEvent: state.lastEvent, decisionHistory: state.decisionHistory || [], flags: state.flags,
  };
}
