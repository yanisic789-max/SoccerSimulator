const app = document.querySelector('#app');
const state = { screen: 'create', view: 'overview', player: null, world: null, season: 2026, period: 0, log: [], lastSeason: null };

const countries = {
  England: { tiers: [['Premier League', ['Manchester City','Arsenal','Liverpool','Manchester United','Chelsea','Tottenham Hotspur','Newcastle United','Aston Villa','West Ham United','Brighton','Crystal Palace','Everton','Wolverhampton','Fulham','Brentford','Nottingham Forest','Bournemouth','Leicester City','Leeds United','Sunderland']], ['Championship', ['Middlesbrough','Norwich City','West Bromwich Albion','Coventry City','Watford','Swansea City','Stoke City','Hull City','Blackburn Rovers','Burnley','Sheffield United','Preston North End','Queens Park Rangers','Millwall','Bristol City','Cardiff City','Portsmouth','Derby County','Sheffield Wednesday','Oxford United']]] },
  Spain: { tiers: [['La Liga', ['Real Madrid','Barcelona','Atletico Madrid','Athletic Club','Real Sociedad','Villarreal','Sevilla','Real Betis','Valencia','Girona','Celta Vigo','Osasuna','Getafe','Mallorca','Rayo Vallecano','Espanyol','Alaves','Las Palmas','Valladolid','Leganes']], ['Segunda Division', ['Levante','Eibar','Racing Santander','Real Zaragoza','Sporting Gijon','Elche','Tenerife','Real Oviedo','Granada','Albacete','Burgos','Mirandes','Huesca','Cadiz','Cartagena','Eldense','Deportivo La Coruna','Malaga','Cordoba','Castellon']]] },
  Germany: { tiers: [['Bundesliga', ['Bayern Munich','Bayer Leverkusen','Borussia Dortmund','RB Leipzig','Eintracht Frankfurt','VfB Stuttgart','Union Berlin','SC Freiburg','Borussia Monchengladbach','Werder Bremen','Mainz 05','Wolfsburg','Augsburg','Hoffenheim','Heidenheim','St Pauli','Holstein Kiel','Bochum'] ], ['2. Bundesliga', ['Hamburg','Hertha Berlin','Schalke 04','FC Koln','Hannover 96','Fortuna Dusseldorf','Nurnberg','Karlsruhe','Paderborn','Darmstadt','Greuther Furth','Kaiserslautern','Magdeburg','Preussen Munster','Elversberg','Ulm','Jahn Regensburg','Eintracht Braunschweig']]] },
  Italy: { tiers: [['Serie A', ['Inter Milan','AC Milan','Juventus','Napoli','Roma','Lazio','Atalanta','Fiorentina','Bologna','Torino','Udinese','Genoa','Monza','Lecce','Parma','Como','Cagliari','Verona','Empoli','Venezia']], ['Serie B', ['Sampdoria','Palermo','Spezia','Bari','Pisa','Cremonese','Sassuolo','Modena','Brescia','Reggiana','Catanzaro','Cittadella','Sudtirol','Mantova','Cesena','Frosinone','Salernitana','Juve Stabia','Carrarese','Cosenza']]] },
  France: { tiers: [['Ligue 1', ['Paris Saint-Germain','Marseille','Monaco','Lyon','Lille','Nice','Lens','Rennes','Strasbourg','Nantes','Montpellier','Toulouse','Brest','Reims','Saint-Etienne','Auxerre','Angers','Le Havre']], ['Ligue 2', ['Metz','Bordeaux','Caen','Guingamp','Lorient','Clermont Foot','Grenoble','Amiens','Laval','Rodez','Pau','Bastia','Ajaccio','Dunkerque','Annecy','Troyes','Red Star','Martigues']]] }
};
const firstNames = ['Alex','Jordan','Morgan','Sam','Charlie','Taylor','Riley','Jamie','Dani','Chris','Matteo','Luca','Nico','Eli','Leo','Noah','Milan','Theo'];
const lastNames = ['Mason','Silva','Costa','Bennett','Martin','Rossi','Muller','Santos','Moreau','Wilson','Young','Turner','Anders','Kovacs','Fischer','Diaz'];
const positions = ['ST','Winger','AM','CM','DM','Fullback','CB','GK'];
const posLabels = { ST: 'Striker', Winger: 'Winger', AM: 'Attacking midfielder', CM: 'Central midfielder', DM: 'Defensive midfielder', Fullback: 'Fullback', CB: 'Centre-back', GK: 'Goalkeeper' };
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = list => list[Math.floor(Math.random() * list.length)];
const clamp = (num, min, max) => Math.max(min, Math.min(max, Math.round(num)));
const id = () => Math.random().toString(36).slice(2, 9);
const money = value => `EUR ${(value / 1000000).toFixed(1)}m`;

function playerName() { return `${pick(firstNames)} ${pick(lastNames)}`; }
function makePlayer({ name = playerName(), age = rand(17, 33), position = pick(positions), base = rand(52, 74), potential = rand(72, 92), human = false } = {}) {
  const attributes = { pace: clamp(base + rand(-7, 8), 35, 95), technique: clamp(base + rand(-6, 8), 35, 95), passing: clamp(base + rand(-8, 9), 35, 95), defending: clamp(base + rand(-8, 9), 25, 95), physical: clamp(base + rand(-7, 8), 35, 95), finishing: clamp(base + rand(-8, 10), 25, 95) };
  const rating = Math.round(Object.values(attributes).reduce((a, b) => a + b, 0) / 6);
  return { id: id(), name, age, position, attributes, ovr: rating, potential: Math.max(potential, rating + 5), fitness: rand(72, 98), injured: 0, goals: 0, assists: 0, matches: 0, awards: [], value: rating * 180000, human };
}
function makeWorld() {
  const clubs = [];
  Object.entries(countries).forEach(([country, data]) => data.tiers.forEach(([league, names], tier) => names.forEach((name, index) => {
    const strength = tier === 0 ? rand(68, 84) + (index < 4 ? 5 : 0) : rand(58, 72);
    clubs.push({ id: id(), name, country, league, tier, strength, budget: strength * 450000, players: Array.from({ length: 15 }, () => makePlayer({ base: strength + rand(-14, 5), potential: rand(65, 88), age: rand(18, 34) })), points: 0, gd: 0, played: 0, wins: 0, draws: 0, losses: 0, goals: 0, conceded: 0 });
  })));
  return { clubs };
}
function resetTables() { state.world.clubs.forEach(c => { c.points = 0; c.gd = 0; c.played = 0; c.wins = 0; c.draws = 0; c.losses = 0; c.goals = 0; c.conceded = 0; }); }
function clubTable(league) { return state.world.clubs.filter(c => c.league === league).sort((a, b) => b.points - a.points || b.gd - a.gd || b.goals - a.goals); }
function playerClub() { return state.world.clubs.find(c => c.id === state.player.clubId); }
function getLeagues() { return [...new Set(state.world.clubs.map(c => c.league))]; }
function log(message) { state.log.unshift(message); state.log = state.log.slice(0, 8); }
function startCareer(form) {
  state.world = makeWorld();
  const position = form.position;
  const player = makePlayer({ name: form.name || 'Unnamed Player', age: 17, position, base: rand(54, 68), potential: rand(76, 95), human: true });
  player.gender = form.gender; player.height = Number(form.height); player.weight = Number(form.weight); player.history = []; player.total = { matches: 0, goals: 0, assists: 0, awards: [], bestOvr: player.ovr, clubs: [], leagues: [], seasons: 0 };
  const choices = state.world.clubs.filter(c => c.tier === 1).sort(() => Math.random() - .5).slice(0, 2);
  const firstDivision = state.world.clubs.filter(c => c.tier === 0).sort(() => Math.random() - .5)[0];
  choices.push(firstDivision);
  state.player = player; state.startChoices = choices; state.screen = 'clubs'; render();
}
function chooseClub(clubId) { state.player.clubId = clubId; const club = playerClub(); club.players.push(state.player); state.player.history.push({ season: state.season, club: club.name, league: club.league }); state.player.total.clubs.push(club.name); state.player.total.leagues.push(club.league); log(`${state.player.name} joins ${club.name} on a first professional contract.`); state.screen = 'game'; render(); }
function performance() {
  const club = playerClub(); const positionFactor = { ST: 1.18, Winger: 1.1, AM: 1.04, CM: .95, DM: .82, Fullback: .74, CB: .58, GK: .35 }[state.player.position];
  const context = club.strength / 75; const ageFactor = state.player.age < 21 ? .96 : state.player.age > 31 ? .93 : 1;
  return Math.max(0, (state.player.ovr * .65 + state.player.fitness * .18 + state.player.potential * .08 + club.strength * .09) * ageFactor * context * positionFactor / 100);
}
function simulatePeriod(training) {
  const player = state.player; const club = playerClub(); const intensity = { light: 0, balanced: 1, hard: 2 }[training];
  const matches = rand(8, 13); const form = performance(); const appearanceRate = clamp(.58 + form * .38 - (player.injured ? .6 : 0), .12, .98); const appearances = Math.round(matches * appearanceRate);
  const goalRate = ({ ST: .31, Winger: .2, AM: .14, CM: .09, DM: .045, Fullback: .04, CB: .025, GK: .005 })[player.position];
  const goals = Math.max(0, Math.round(appearances * goalRate * (player.ovr / 65) * (player.fitness / 85) * (0.85 + Math.random() * .4)));
  const assists = Math.max(0, Math.round(appearances * ({ ST: .1, Winger: .18, AM: .22, CM: .13, DM: .08, Fullback: .1, CB: .02, GK: .01 })[player.position] * (player.ovr / 68) * (0.8 + Math.random() * .5)));
  const teamForm = rand(3, 8) + Math.round(club.strength / 18) + (form > .75 ? 2 : 0); club.wins += Math.round(teamForm * .48); club.draws += Math.round(teamForm * .18); club.losses += matches - teamForm; club.played += matches; club.goals += teamForm + rand(4, 13); club.conceded += rand(5, 14); club.points += club.wins * 3 + club.draws;
  player.matches += appearances; player.goals += goals; player.assists += assists; player.total.matches += appearances; player.total.goals += goals; player.total.assists += assists;
  const youngDevelopment = player.age < 25 ? 1.25 : player.age < 30 ? .7 : -.25; const fitnessCost = intensity === 2 ? rand(8, 15) : intensity === 1 ? rand(4, 9) : rand(1, 5);
  const gain = youngDevelopment * intensity + (form > .72 ? .7 : 0) - (player.age > 32 ? .55 : 0);
  player.ovr = clamp(player.ovr + (gain > 0 ? rand(0, Math.max(1, Math.round(gain))) : rand(-1, 0)), 40, player.potential);
  Object.keys(player.attributes).forEach(key => { player.attributes[key] = clamp(player.attributes[key] + (gain > .5 ? rand(0, 1) : gain < 0 ? -rand(0, 1) : 0), 25, 99); });
  player.fitness = clamp(player.fitness - fitnessCost + (training === 'light' ? 7 : 0), 5, 99);
  const ageRisk = player.age > 29 ? .09 : .025; const injuryRisk = (intensity === 2 ? .13 : intensity === 1 ? .06 : .025) + (100 - player.fitness) / 360 + ageRisk;
  if (Math.random() < injuryRisk) { player.injured = rand(1, 3); log(`${player.name} picked up a ${player.injured}-period injury in training.`); } else if (player.injured) player.injured--;
  log(`${club.name}: ${appearances} appearances, ${goals} goals, ${assists} assists. ${training} training moved OVR to ${player.ovr}.`);
  simulateOtherClubs();
  state.period++;
}
function simulateOtherClubs() {
  state.world.clubs.filter(c => c.id !== state.player.clubId).forEach(club => {
    const matches = rand(8, 13);
    const wins = rand(2, 7);
    const draws = rand(1, 3);
    club.played += matches;
    club.wins += wins;
    club.draws += draws;
    club.losses += Math.max(0, matches - wins - draws);
    club.points += wins * 3 + draws;
    club.goals += rand(7, 19);
    club.conceded += rand(6, 17);
    club.gd = club.goals - club.conceded;
    const activePlayers = club.players.filter(p => !p.retired);
    activePlayers.forEach(p => {
      const appearances = rand(3, matches);
      p.matches += appearances;
      if (Math.random() < ({ ST: .3, Winger: .2, AM: .14, CM: .08, DM: .04, Fullback: .035, CB: .025, GK: .005 })[p.position]) p.goals += rand(0, 2);
      if (Math.random() < .35) p.assists += rand(0, 1);
    });
  });
}
function simulateWorld() {
  state.world.clubs.filter(c => c.id !== state.player.clubId).forEach(club => {
    club.players.forEach(p => { p.age += state.period === 4 ? 1 : 0; p.ovr = clamp(p.ovr + (p.age < 26 ? rand(-1, 2) : rand(-2, 1)), 35, p.potential); p.fitness = clamp(p.fitness + rand(-5, 5), 35, 98); if (p.age > 36 && Math.random() < .18) p.retired = true; });
    club.players = club.players.filter(p => !p.retired);
  });
}
function halfwayDecision(action) { if (action === 'retire') return retire(); if (action === 'request') { state.player.transferRequested = true; log('Transfer request filed. Scouts will test the market at season end.'); render(); } if (action === 'leave') { state.player.leaveRequested = true; log('You will leave at season end unless a new club is found.'); render(); } }
function endSeason() {
  const player = state.player; const club = playerClub(); const table = clubTable(club.league); const position = table.findIndex(c => c.id === club.id) + 1;
  const awards = []; const scorers = state.world.clubs.flatMap(c => c.players).sort((a, b) => b.goals - a.goals); const assists = state.world.clubs.flatMap(c => c.players).sort((a, b) => b.assists - a.assists); const leaguePlayers = state.world.clubs.filter(c => c.league === club.league).flatMap(c => c.players);
  const topScorer = leaguePlayers.sort((a, b) => b.goals - a.goals)[0]; const topAssist = leaguePlayers.sort((a, b) => b.assists - a.assists)[0]; const playerScore = player.goals * 3 + player.assists * 2 + player.matches + player.ovr; const best = leaguePlayers.sort((a, b) => (b.goals * 3 + b.assists * 2 + b.matches + b.ovr) - (a.goals * 3 + a.assists * 2 + a.matches + a.ovr))[0];
  if (topScorer && topScorer.id === player.id) awards.push('League Golden Boot'); if (topAssist && topAssist.id === player.id) awards.push('League Playmaker'); if (best && best.id === player.id) awards.push('Player of the Season');
  if (awards.length) { player.awards.push(...awards); player.total.awards.push(...awards.map(a => `${state.season} ${a}`)); log(`${player.name} won ${awards.join(', ')}.`); }
  player.total.seasons++; player.total.bestOvr = Math.max(player.total.bestOvr, player.ovr); player.history[player.history.length - 1].stats = `${player.matches} apps, ${player.goals} goals, ${player.assists} assists`;
  state.lastSeason = { season: state.season, club: club.name, position, awards, topScorer: topScorer?.name, topAssists: topAssist?.name, playerScore, table: table.slice(0, 5).map(c => ({ name: c.name, points: c.points })) };
  player.matches = 0; player.goals = 0; player.assists = 0; player.age++;
  applyPromotionRelegation();
  runWorldTransfers();
  transferMarket();
  state.season++; state.period = 0; resetTables(); simulateWorld(); render();
}
function applyPromotionRelegation() {
  Object.values(countries).forEach(data => {
    const topLeague = data.tiers[0][0];
    const lowerLeague = data.tiers[1][0];
    const promoted = clubTable(lowerLeague).slice(0, 2);
    const relegated = clubTable(topLeague).slice(-2);
    promoted.forEach(club => { club.league = topLeague; club.tier = 0; club.strength += 2; });
    relegated.forEach(club => { club.league = lowerLeague; club.tier = 1; club.strength = Math.max(48, club.strength - 2); });
    if (promoted.length && relegated.length) log(`${promoted.map(c => c.name).join(' and ')} promoted; ${relegated.map(c => c.name).join(' and ')} relegated.`);
  });
}
function runWorldTransfers() {
  state.world.clubs.forEach(club => {
    const outgoing = club.players.filter(p => !p.human && p.age > 31 && p.ovr < club.strength - 6).slice(0, 2);
    outgoing.forEach(player => { club.players = club.players.filter(p => p.id !== player.id); });
    outgoing.forEach(player => {
      const destinations = state.world.clubs.filter(c => c.id !== club.id && c.country === club.country && c.strength <= player.ovr + 8);
      (destinations.length ? pick(destinations) : club).players.push(player);
    });
  });
}
function transferMarket() {
  const player = state.player; const old = playerClub(); let target = null;
  if (player.leaveRequested || player.transferRequested) { const interest = state.world.clubs.filter(c => c.id !== old.id && c.strength <= player.ovr + 15 && c.strength >= player.ovr - 18).sort((a, b) => b.strength - a.strength); const chance = player.transferRequested && player.age < 29 ? .75 : .45; if (interest.length && Math.random() < chance) target = interest[0]; }
  if (target) { old.players = old.players.filter(p => p.id !== player.id); target.players.push(player); player.clubId = target.id; player.transferRequested = false; player.leaveRequested = false; player.history.push({ season: state.season, club: target.name, league: target.league }); player.total.clubs.push(target.name); player.total.leagues.push(target.league); log(`${player.name} transferred to ${target.name} for ${money(player.value)}.`); } else if (player.leaveRequested) { player.leaveRequested = false; log('No suitable exit materialized. The club kept the contract active.'); }
}
function retire() { const p = state.player; const status = p.total.awards.length >= 8 || (p.total.goals > 180 && p.total.bestOvr >= 88) ? 'GOAT' : p.total.awards.length >= 4 || p.total.bestOvr >= 84 ? 'Legend' : p.total.awards.length >= 2 || p.total.bestOvr >= 78 ? 'Star' : p.total.seasons >= 2 ? 'Professional' : 'Prospect'; state.retirement = { ...p, status }; state.screen = 'retired'; render(); }
function allStats() { return state.world.clubs.flatMap(c => c.players.map(p => ({ ...p, club: c.name, league: c.league }))); }
function renderCreate() { app.innerHTML = `<div class="app-shell"><header class="topbar"><div class="brand"><span class="brand-mark"></span> Touchline</div><span class="season-chip">CAREER SIMULATION / 01</span></header><main class="page setup"><section><div class="eyebrow">The numbers tell the story</div><h1>Build a career<br>worth remembering.</h1><p class="lead">A football career simulator where potential, training choices, fitness, transfers and the quiet pressure of a full season shape everything. No live match control. Just the long game.</p></section><form class="form-panel" id="create-form"><div class="eyebrow">Player registration</div><h2>Start with the details scouts can see.</h2><div class="form-grid"><div class="field full"><label>Name</label><input name="name" placeholder="e.g. Avery Cole" required></div><div class="field"><label>Gender</label><select name="gender"><option>Male</option><option>Female</option><option>Non-binary</option></select></div><div class="field"><label>Position</label><select name="position">${positions.map(p => `<option value="${p}">${p} / ${posLabels[p]}</option>`).join('')}</select></div><div class="field"><label>Height (cm)</label><input name="height" type="number" min="150" max="210" value="180" required></div><div class="field"><label>Weight (kg)</label><input name="weight" type="number" min="45" max="120" value="75" required></div></div><div class="form-actions"><button class="button alt">Generate player profile</button></div><p class="profile-meta" style="margin:16px 0 0">Starting ability varies. Potential is hidden and cannot be inspected.</p></form></main></div>`; document.querySelector('#create-form').onsubmit = e => { e.preventDefault(); startCareer(Object.fromEntries(new FormData(e.target))); }; }
function renderChoices() { app.innerHTML = `<div class="app-shell"><header class="topbar"><div class="brand"><span class="brand-mark"></span> Touchline</div><span class="season-chip">SCOUTING REPORT / ${state.player.name.toUpperCase()}</span></header><main class="page"><div class="eyebrow">Contract offers / Season ${state.season}</div><h1>Three doors.<br>One first chapter.</h1><p class="lead">Your first contract is generated from the current football ecosystem. The third option is an uncommon top-flight opportunity.</p><div class="club-picks">${state.startChoices.map((club, i) => `<button class="club-pick" data-club="${club.id}"><span class="eyebrow">${i === 2 ? 'Long shot' : 'Recommended'} / ${club.country}</span><strong>${club.name}</strong><small>${club.league}<br>Squad strength ${club.strength} / 100<br>Role fit: ${club.strength > state.player.ovr ? 'rotation prospect' : 'immediate starter'}</small></button>`).join('')}</div></main></div>`; document.querySelectorAll('[data-club]').forEach(b => b.onclick = () => chooseClub(b.dataset.club)); }
function renderSidebar() { const p = state.player, c = playerClub(); return `<aside class="sidebar"><div class="profile-head"><div class="eyebrow">Player profile</div><h2>${p.name}</h2><div class="rating">${p.ovr}</div><div class="profile-meta">OVR / ${posLabels[p.position]}<br>${p.age} years / ${p.gender}<br>${p.height} cm / ${p.weight} kg</div></div><nav class="sidebar-nav">${[['overview','Dashboard'],['leagues','Leagues'],['clubs','Clubs'],['players','Player stats']].map(([view, label]) => `<button class="nav-button ${state.view === view ? 'active' : ''}" data-view="${view}">${label}</button>`).join('')}</nav><div class="sidebar-footer"><strong>${c.name}</strong><br>${c.league}, ${c.country}<br><br>Potential remains hidden.<br>Only development reveals it.</div></aside>`; }
function renderOverview() { const p = state.player, c = playerClub(), table = clubTable(c.league), rank = table.findIndex(x => x.id === c.id) + 1; return `<div class="content-top"><div><div class="eyebrow">Career dashboard / ${c.country}</div><h1>${c.name}</h1></div><div class="period-box"><span class="eyebrow">Season ${state.season}</span><strong>Period ${state.period + 1} / 4</strong><div class="period-track">${[0,1,2,3].map(i => `<span class="period-dot ${i < state.period ? 'done' : ''} ${i === state.period ? 'current' : ''}"></span>`).join('')}</div></div></div>${state.lastSeason ? `<div class="notice">Season ${state.lastSeason.season} closed at <strong>${state.lastSeason.club} #${state.lastSeason.position}</strong>. ${state.lastSeason.awards.length ? `Awards: ${state.lastSeason.awards.join(', ')}.` : 'No league award this time.'}</div>` : ''}<div class="stat-grid"><div class="stat"><label>Position</label><strong>${p.position}</strong><em>${posLabels[p.position]}</em></div><div class="stat"><label>Fitness</label><strong>${p.fitness}%</strong><div class="progress"><span style="width:${p.fitness}%"></span></div></div><div class="stat"><label>Club rank</label><strong>#${rank}</strong><em>${c.league}</em></div><div class="stat"><label>Season output</label><strong>${p.goals}G</strong><em>${p.matches} apps / ${p.assists} A</em></div></div><div class="grid" style="margin-top:20px"><section class="panel"><div class="panel-head"><h2>${c.league} table</h2><span class="eyebrow">Live simulation</span></div>${tableHtml(table, c.id)}</section><section class="panel"><div class="panel-head"><h2>Club intel</h2><span class="eyebrow">${c.strength} strength</span></div><div class="news"><div class="news-item"><strong>Contract value</strong>${money(p.value)} / ${p.age < 23 ? 'development deal' : 'senior deal'}</div><div class="news-item"><strong>Training profile</strong>Young players gain more from hard sessions; veteran bodies pay the injury bill.</div><div class="news-item"><strong>Latest wire</strong>${state.log[0] || 'The season is waiting for its first data point.'}</div></div></section></div><section class="panel" style="margin-top:20px"><div class="panel-head"><h2>Simulate next period</h2><span class="eyebrow">Choose your risk</span></div><p class="profile-meta">Hard training accelerates development while young, but raises injury risk. Light training restores fitness. Midseason decisions unlock after Period 2.</p><div class="action-bar"><button class="button ghost" data-train="light">Light / recover</button><button class="button alt" data-train="balanced">Balanced / steady</button><button class="button" data-train="hard">Hard / develop</button>${state.period >= 2 ? `<button class="button danger" data-decision="retire">Retire</button><button class="button ghost" data-decision="request">Request transfer</button><button class="button ghost" data-decision="leave">Leave at season end</button>` : ''}</div></section><section class="panel" style="margin-top:20px"><div class="panel-head"><h2>Season feed</h2><span class="eyebrow">Recent events</span></div><div class="news">${state.log.map(x => `<div class="news-item">${x}</div>`).join('') || '<div class="news-item">No events yet.</div>'}</div></section></div>`; }
function tableHtml(table, highlight) { return `<div class="table-wrap"><table><thead><tr><th>#</th><th>Club</th><th>Pl</th><th>W</th><th>GD</th><th>Pts</th></tr></thead><tbody>${table.map((c, i) => `<tr class="${c.id === highlight ? 'highlight' : ''}"><td class="rank">${i + 1}</td><td>${c.name}</td><td>${c.played}</td><td>${c.wins}</td><td>${c.gd}</td><td><strong>${c.points}</strong></td></tr>`).join('')}</tbody></table></div>`; }
function renderLeagues() { const current = document.querySelector('#league-select')?.value || getLeagues()[0]; const table = clubTable(current); return `<div class="content-top"><div><div class="eyebrow">Competition centre</div><h1>Leagues</h1></div><select class="inline-select" id="league-select">${getLeagues().map(l => `<option ${l === current ? 'selected' : ''}>${l}</option>`).join('')}</select></div><div class="panel"><div class="panel-head"><h2>${current}</h2><span class="eyebrow">${table.length} clubs / ${state.season}</span></div>${tableHtml(table, playerClub().id)}</div>`; }
function renderClubs() { const clubs = state.world.clubs.filter(c => c.country === (document.querySelector('#country-select')?.value || 'England')); return `<div class="content-top"><div><div class="eyebrow">Scouting network</div><h1>Clubs</h1></div><select class="inline-select" id="country-select">${Object.keys(countries).map(c => `<option>${c}</option>`).join('')}</select></div><div class="club-list">${clubs.map(c => `<div class="club-row"><div><strong>${c.name}</strong><small>${c.league} / ${c.players.length} players</small></div><strong>${c.strength}</strong></div>`).join('')}</div>`; }
function renderPlayers() { const current = document.querySelector('#leader-select')?.value || 'goals'; const players = allStats().sort((a, b) => b[current] - a[current]).slice(0, 15); return `<div class="content-top"><div><div class="eyebrow">League-wide production</div><h1>Player stats</h1></div><select class="inline-select" id="leader-select"><option value="goals" ${current === 'goals' ? 'selected' : ''}>Top scorers</option><option value="assists" ${current === 'assists' ? 'selected' : ''}>Top assists</option><option value="ovr" ${current === 'ovr' ? 'selected' : ''}>Highest OVR</option></select></div><div class="panel"><div class="panel-head"><h2>${current === 'goals' ? 'Golden Boot race' : current === 'assists' ? 'Playmaker chart' : 'World ratings'}</h2><span class="eyebrow">All major leagues</span></div><div class="table-wrap"><table><thead><tr><th>#</th><th>Player</th><th>Club</th><th>Pos</th><th>${current.toUpperCase()}</th><th>Age</th></tr></thead><tbody>${players.map((p, i) => `<tr class="${p.id === state.player.id ? 'highlight' : ''}"><td class="rank">${i + 1}</td><td>${p.name}</td><td>${p.club}</td><td>${p.position}</td><td><strong>${p[current]}</strong></td><td>${p.age}</td></tr>`).join('')}</tbody></table></div></div>`; }
function renderGame() { const body = state.view === 'overview' ? renderOverview() : state.view === 'leagues' ? renderLeagues() : state.view === 'clubs' ? renderClubs() : renderPlayers(); app.innerHTML = `<div class="app-shell"><header class="topbar"><div class="brand"><span class="brand-mark"></span> Touchline</div><span class="season-chip">${state.season} / ${playerClub().league.toUpperCase()}</span></header><main class="page dashboard">${renderSidebar()}<section class="content">${body}</section></main></div>`; document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => { state.view = b.dataset.view; render(); }); document.querySelectorAll('[data-train]').forEach(b => b.onclick = () => { simulatePeriod(b.dataset.train); if (state.period >= 4) endSeason(); else render(); }); document.querySelectorAll('[data-decision]').forEach(b => b.onclick = () => halfwayDecision(b.dataset.decision)); document.querySelector('#league-select')?.addEventListener('change', render); document.querySelector('#country-select')?.addEventListener('change', render); document.querySelector('#leader-select')?.addEventListener('change', render); }
function renderRetired() { const p = state.retirement; app.innerHTML = `<div class="app-shell"><header class="topbar"><div class="brand"><span class="brand-mark"></span> Touchline</div><span class="season-chip">CAREER ARCHIVE / FINAL REPORT</span></header><main class="page summary"><section class="summary-hero"><div class="eyebrow">Career complete</div><h1>${p.name}</h1><p>${p.status} / retired at age ${p.age} / best OVR ${p.total.bestOvr}</p></section><div class="summary-grid"><div class="stat"><label>Matches</label><strong>${p.total.matches}</strong></div><div class="stat"><label>Goals</label><strong>${p.total.goals}</strong></div><div class="stat"><label>Assists</label><strong>${p.total.assists}</strong></div><div class="stat"><label>Seasons</label><strong>${p.total.seasons}</strong></div></div><section class="panel" style="margin-top:20px"><div class="panel-head"><h2>Major achievements</h2><span class="eyebrow">Measured, not random</span></div><div class="award"><div class="award-badge">OVR</div><div><strong>Peak rating ${p.total.bestOvr}</strong><br><span class="profile-meta">The highest level reached in the simulated career.</span></div></div>${p.total.awards.length ? p.total.awards.map(a => `<div class="award"><div class="award-badge">01</div><div><strong>${a}</strong></div></div>`).join('') : '<p class="profile-meta">No individual awards, but every professional season counts.</p>'}</section><section class="panel" style="margin-top:20px"><div class="panel-head"><h2>Career path</h2><span class="eyebrow">Clubs / leagues</span></div><div class="timeline">${p.history.map(h => `<div class="timeline-item"><strong>Season ${h.season} / ${h.club}</strong><br><span class="profile-meta">${h.league}${h.stats ? ` / ${h.stats}` : ''}</span></div>`).join('')}</div></section><button class="button alt" style="margin-top:20px" onclick="location.reload()">Start a new career</button></main></div>`; }
function render() { if (state.screen === 'create') renderCreate(); else if (state.screen === 'clubs') renderChoices(); else if (state.screen === 'retired') renderRetired(); else renderGame(); }
render();
