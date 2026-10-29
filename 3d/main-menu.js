export const GAME_TAGLINE='Every decision leaves a trace.';
export function mainMenu(checkpoint,seenCount){
 return `<section class="game-menu" aria-label="Ghost Shift main menu">
  <div class="menu-location"><span class="signal-dot" aria-hidden="true"></span>MUMBAI / 02:17 AM<span>MERIDIAN DATAWORKS</span></div>
  <div class="menu-layout"><div class="menu-primary">
   <div class="game-lockup"><img class="game-emblem" src="media/ghost-shift-logo.svg" alt="Ghost Shift shield emblem" width="112" height="112"><div><p class="menu-kicker">A DATA PROTECTION THRILLER</p><h1>GHOST SHIFT<small>MIDNIGHT BREACH</small></h1></div></div>
   <p class="game-tagline">${GAME_TAGLINE}</p>
   <p class="menu-story">A midnight export. A missing signature. Four floors of conflicting evidence.<br>You are the Data Protection Officer. Find the truth before the city wakes.</p>
   ${checkpoint?'<div class="menu-checkpoint"><span>LAST CHECKPOINT / '+checkpoint.state.turn/3+' CASES COMPLETE</span><button id="resume-shift" class="primary">RESUME SHIFT <span aria-hidden="true">→</span></button></div>':''}
   <nav class="menu-actions" aria-label="Main menu actions"><button id="solo" class="primary menu-start">START GAME <span aria-hidden="true">→</span></button><div class="menu-secondary"><button id="shift-options" class="secondary">SHIFT OPTIONS</button><button id="tutorial" class="secondary">HOW TO PLAY</button><button id="about-game" class="secondary">ABOUT THE GAME</button></div></nav>
   <div class="menu-meta"><span>FIRST-PERSON</span><span>SINGLE-PLAYER</span><span>10 LINKED CASES</span><span>HIGH FX</span></div>
   <div class="menu-library"><button id="archive" class="small">CASE ARCHIVE · ${seenCount}/10</button><button id="history" class="small">SHIFT RECORDS</button><button id="watch-team" class="small">CREDITS</button><button id="watch-intro" class="small">REPLAY INTRO</button></div>
  </div><aside class="menu-dossier" aria-label="Operation Blue Lantern briefing"><div class="dossier-heading"><span>CLASSIFIED / CASE 001</span><b>BLUE LANTERN</b></div><div class="dossier-signal" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><p class="dossier-label">YOUR MISSION</p><ol><li><strong>Preserve the evidence.</strong><span>Inspect the records at each case desk.</span></li><li><strong>Trace the export.</strong><span>Challenge accounts across floors 47–50.</span></li><li><strong>Make the call.</strong><span>Protect the people behind the data.</span></li></ol><div class="dossier-footer"><span>STATUS / UNRESOLVED</span><span class="signal-dot" aria-hidden="true"></span></div></aside></div>
  <div class="menu-bottom"><p>SHA/020 · NIKS/141 · RIP/911</p><p>Soundtrack By Renjith Mohan M R</p></div>
 </section>`;
}
