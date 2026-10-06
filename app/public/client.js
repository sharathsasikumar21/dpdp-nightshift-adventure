const $ = (id) => document.getElementById(id);
const PING = "__ping", PONG = "__pong";
const HISTORY_KEY = "dq:investigator", SESSION_KEY = "dq:active-session:story-v2";
let identity = localStorage.getItem(HISTORY_KEY);
if (!identity) { identity = crypto.randomUUID(); localStorage.setItem(HISTORY_KEY, identity); }
let sessionId = "", socket = null, retry = 0, latestState = null, pendingChoice = false;
let voiceEnabled = localStorage.getItem("dq:voice-enabled") !== "false", narratedScene = "", narratedEvent = "", narratedEnding = "";

function syncVoiceButton() {
  const button = $("voice-toggle"); button.setAttribute("aria-pressed", String(voiceEnabled));
  button.textContent = voiceEnabled ? "Voice · on" : "Voice · off";
}
function speak(text, interrupt = false) {
  if (!voiceEnabled || !text || !("speechSynthesis" in window)) return;
  if (interrupt) speechSynthesis.cancel();
  const line = new SpeechSynthesisUtterance(text); line.rate = 1.04; line.pitch = 1.08;
  const voices = speechSynthesis.getVoices();
  line.voice = voices.find((voice) => /^en([_-]|$)/i.test(voice.lang) && /natural|neural|google/i.test(voice.name)) || voices.find((voice) => /^en([_-]|$)/i.test(voice.lang)) || null;
  speechSynthesis.speak(line);
}
function narrateDecision(current, step, queueAfterOutcome = false) {
  const key = sessionId + ":" + step;
  if (key !== narratedScene) {
    narratedScene = key; const line = current.echo + " " + current.q;
    if (activeAudio && !activeAudio.paused && !activeAudio.ended) activeAudio.addEventListener("ended", () => speak(line, true), { once: true });
    else speak(line, !queueAfterOutcome);
  }
}
function narrateOutcome(event, nextLine = "") {
  const key = sessionId + ":" + event.step;
  if (key === narratedEvent) return false;
  narratedEvent = key;
  const quips = {
    clean: "Responsible choice. Somewhere, an auditor just unclenched their jaw.",
    mixed: "A compromise. The launch is pleased; Legal has opened a fresh tab.",
    bad: "Bold shortcut. The exposure meter would like to thank you for the attention."
  };
  const line = (quips[event.outcome] || "Decision logged. The consequences have joined the meeting.") + " " + event.consequence;
  speak(line + (nextLine ? " " + nextLine : ""), true); return true;
}

function setStatus(text, error = false) {
  const el = $("status"); el.textContent = text; el.classList.toggle("error", error);
  $("connection").textContent = error ? "SIGNAL DEGRADED" : text;
}
function safeSession() {
  try { const value = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); return value && value.playerId === identity && typeof value.sessionId === "string" ? value.sessionId : ""; }
  catch { return ""; }
}
async function makeSession() {
  const candidate = crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ playerId: identity, sessionId: candidate }));
  const response = await fetch("/api/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ playerId: identity, sessionId: candidate }) });
  if (!response.ok) { const details = await response.json().catch(() => ({})); throw new Error(details.error || "Could not open a new case."); }
  const result = await response.json();
  if (!result || result.sessionId !== candidate) throw new Error("The case assignment could not be confirmed.");
  return candidate;
}
function beginView() { $("intro").classList.add("hidden"); $("ending").classList.add("hidden"); $("play").classList.remove("hidden"); }
async function launch(forceNew = false) {
  if (!forceNew && !safeSession()) narratedScene = "";
  setStatus("requesting case file…"); $("begin").disabled = true; $("again").disabled = true;
  try {
    const saved = !forceNew && safeSession(); sessionId = saved || await makeSession(); beginView();
    if (socket) socket.close(); retry = 0; pendingChoice = false; connect();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Case assignment failed.", true);
    $("begin").disabled = false; $("again").disabled = false;
  }
}
function connect() {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  const ws = new WebSocket(protocol + "//" + location.host + "/ws/" + encodeURIComponent(sessionId));
  socket = ws;
  ws.addEventListener("open", () => { retry = 0; setStatus("secure channel open"); ws.send(JSON.stringify({ type: "join", playerId: identity, sessionId })); });
  ws.addEventListener("message", (event) => {
    if (event.data === PONG) return;
    let message; try { message = JSON.parse(event.data); } catch { return; }
    if (message.type === "state") render(message); else if (message.type === "error") { pendingChoice = false; setStatus(message.error, true); }
  });
  ws.addEventListener("close", () => {
    if (socket !== ws || !sessionId) return;
    retry = Math.min(retry + 1, 6); const delay = Math.min(500 * 2 ** (retry - 1), 16000);
    setStatus("connection lost · retrying in " + Math.ceil(delay / 1000) + "s", true); setTimeout(connect, delay);
  });
}
function send(choice) {
  if (pendingChoice || socket?.readyState !== WebSocket.OPEN) return;
  pendingChoice = true;
  document.querySelectorAll(".choice").forEach((button) => { button.disabled = true; button.classList.add("locked"); });
  socket.send(JSON.stringify({ type: "action", action: { choice } })); setStatus("decision sent · waiting for incident log");
}
function meter(name, value) {
  $(name + "-value").textContent = String(value); $(name + "-meter").style.width = Math.max(0, Math.min(100, value)) + "%";
}
function sceneFor(current) {
  const sourceId = current.sourceId || current.id;
  const consent = ["notice","withdraw","purpose","minimum","consentproof","noticewithdraw","consentmanager","consentseparate","lawfulbasis"].includes(sourceId);
  const exposure = ["security","breach","processor","securityvendor","foreign","fiduciary","breachnotice","accesscontrol"].includes(sourceId);
  $("scene-image").src = consent ? "/assets/consent.jpg" : exposure ? "/assets/exposure.jpg" : "/assets/hero.jpg";
  $("scene-label").textContent = consent ? "CONSENT SIGNAL" : exposure ? "EXPOSURE WATCH" : "NIGHT SHIFT";
}
function renderChoices(current) {
  const root = $("choices"); root.replaceChildren();
  current.options.forEach((text, index) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "choice";
    const key = document.createElement("span"); key.className = "key"; key.textContent = String.fromCharCode(65 + index);
    const label = document.createElement("span"); label.textContent = text;
    button.append(key, label); button.addEventListener("click", () => send(index)); root.append(button);
  });
}
function showFeedback(event) {
  const box = $("feedback");
  if (!event) { box.classList.add("hidden"); box.replaceChildren(); return; }
  box.classList.remove("hidden"); box.replaceChildren();
  const title = document.createElement("h3"); title.textContent = event.outcome === "clean" ? "Field report · strong call" : "Field report · consequence logged";
  const consequence = document.createElement("p"); consequence.textContent = event.consequence;
  const reason = document.createElement("p");
  const label = event.outcome === "clean" ? "Why it holds: " : "Why it fails: ";
  reason.textContent = label + (event.explanation || event.why || "Review the cited provision before the next decision.");
  const points = document.createElement("p"); points.textContent = "+" + Number(event.points || 0) + " points · " + Number(event.score || 0) + " total · " + (event.level || "Policy Intern");
  const law = document.createElement("p"); law.className = "law"; law.textContent = event.law + " · Legal review";
  box.append(title, consequence, reason, points, law);
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char])); }
function showEnding(result, view) {
  $("play").classList.add("hidden"); $("ending").classList.remove("hidden");
  $("ending-title").textContent = result?.title || "Shift complete";
  $("ending-detail").textContent = result?.detail || "Your decisions have been recorded.";
  const stats = $("ending-stats"); stats.replaceChildren();
  [["SCORE",view.score + " · " + (view.level || "Policy Intern")],["TRUST",view.trust],["EXPOSURE",view.exposure],["CONTINUITY",view.continuity],["EVIDENCE",view.evidence]].forEach((entry) => {
    const chip = document.createElement("span"); chip.textContent = entry[0] + " " + entry[1]; stats.append(chip);
  });
  const review = $("decision-review"); review.replaceChildren();
  (view.decisionHistory || []).forEach((event, index) => {
    const card = document.createElement("article"); card.className = "review-card" + (event.outcome === "clean" ? "" : " wrong");
    const heading = document.createElement("h3"); heading.textContent = "Decision " + (index + 1) + " · " + (event.storyTitle || "Case file") + (event.outcome === "clean" ? " · defensible" : " · non-compliant");
    const question = document.createElement("p"); question.innerHTML = '<span class="review-label">Situation</span><br>' + escapeHtml(event.question || "");
    const picked = document.createElement("p"); picked.innerHTML = '<span class="review-label">Action taken</span><br>' + escapeHtml(event.choiceText || "");
    const reason = document.createElement("p"); reason.innerHTML = '<span class="review-label">' + (event.outcome === "clean" ? "Why it holds" : "Why it was wrong") + '</span><br>' + escapeHtml(event.explanation || event.why || "");
    const consequence = document.createElement("p"); consequence.innerHTML = '<span class="review-label">Consequence</span><br>' + escapeHtml(event.consequence || "");
    const law = document.createElement("p"); law.className = "law"; law.textContent = (event.law || "") + " · " + Number(event.points || 0) + " points";
    card.append(heading, question, picked, reason, consequence, law); review.append(card);
  });
  const event = view.lastEvent;
  if (event) {
    const report = document.createElement("p"); report.textContent = "Final decision: " + event.consequence + " " + (event.explanation || event.why || "") + " " + event.law;
    $("ending-report").textContent = report.textContent;
  }
  const endKey = sessionId + ":closed";
  if (endKey !== narratedEnding) {
    narratedEnding = endKey;
    const endingLine = (result?.title || "Shift complete") + ". " + (result?.detail || "Your decisions have been recorded.");
    if (!event || !narrateOutcome(event, endingLine)) speak(endingLine, true);
  }
  $("connection").textContent = "CASE CLOSED";
}
function render(message) {
  latestState = message; pendingChoice = false; const view = message.view || {};
  if (message.status === "over") { showEnding(message.result, view); return; }
  beginView(); $("begin").disabled = false; $("again").disabled = false;
  const current = view.current, step = Number(view.step || 0), total = Number(view.total || 15);
  $("chapter").textContent = current ? current.storyTitle + " · PART " + current.storyPart + "/3" : "Awaiting case assignment";
  $("case-count").textContent = step + " / " + total + " DECISIONS";
  $("progress-bar").style.width = (total ? step / total * 100 : 0) + "%";
  meter("trust", Number(view.trust || 0)); meter("exposure", Number(view.exposure || 0));
  meter("continuity", Number(view.continuity || 0)); meter("evidence", Number(view.evidence || 0));
  $("score-value").textContent = String(view.score || 0); $("level-value").textContent = view.level || "Policy Intern";
  if (!current) return;
  sceneFor(current); $("prompt").textContent = current.q; renderChoices(current);
  const echo = $("echo"); echo.textContent = current.echo; echo.classList.remove("hidden");
  showFeedback(view.lastEvent);
  const narratedOutcome = view.lastEvent ? narrateOutcome(view.lastEvent, current.echo + " " + current.q) : false;
  if (narratedOutcome) narratedScene = sessionId + ":" + step;
  else narrateDecision(current, step, Boolean(view.lastEvent));
  setStatus("decision ready");
}
$("begin").addEventListener("click", () => launch(false));
$("again").addEventListener("click", () => launch(true));
syncVoiceButton();
$("voice-toggle").addEventListener("click", () => {
  voiceEnabled = !voiceEnabled; localStorage.setItem("dq:voice-enabled", String(voiceEnabled)); syncVoiceButton();
  if (voiceEnabled) speak("Voice briefing online. Let’s make choices the incident report can live with.", true);
  else if ("speechSynthesis" in window) speechSynthesis.cancel();
});
setInterval(() => { if (socket?.readyState === WebSocket.OPEN) socket.send(PING); }, 30000);
const resume = safeSession();
if (resume) { sessionId = resume; beginView(); connect(); }
