// Traduce nombres de equipo de football-data.org (inglés) a los nombres usados en la app (español)
const NAME_MAP = {
  "Algeria": "Argelia",
  "Argentina": "Argentina",
  "Australia": "Australia",
  "Austria": "Austria",
  "Belgium": "Bélgica",
  "Bosnia-Herzegovina": "Bosnia-Herz.",
  "Brazil": "Brasil",
  "Canada": "Canadá",
  "Cape Verde Islands": "Cabo Verde",
  "Colombia": "Colombia",
  "Congo DR": "DR Congo",
  "Croatia": "Croacia",
  "Curaçao": "Curazao",
  "Czechia": "Rep. Checa",
  "Ecuador": "Ecuador",
  "Egypt": "Egipto",
  "England": "Inglaterra",
  "France": "Francia",
  "Germany": "Alemania",
  "Ghana": "Ghana",
  "Haiti": "Haití",
  "Iran": "Irán",
  "Iraq": "Iraq",
  "Ivory Coast": "Costa de Marfil",
  "Japan": "Japón",
  "Jordan": "Jordania",
  "Mexico": "México",
  "Morocco": "Marruecos",
  "Netherlands": "Países Bajos",
  "New Zealand": "Nueva Zelanda",
  "Norway": "Noruega",
  "Panama": "Panamá",
  "Paraguay": "Paraguay",
  "Portugal": "Portugal",
  "Qatar": "Qatar",
  "Saudi Arabia": "Arabia Saudí",
  "Scotland": "Escocia",
  "Senegal": "Senegal",
  "South Africa": "Sudáfrica",
  "South Korea": "Corea del Sur",
  "Spain": "España",
  "Sweden": "Suecia",
  "Switzerland": "Suiza",
  "Tunisia": "Túnez",
  "Turkey": "Turquía",
  "United States": "EE.UU.",
  "Uruguay": "Uruguay",
  "Uzbekistan": "Uzbekistán",
};

const LIVE_STATUSES = new Set(["IN_PLAY", "PAUSED"]);
const DONE_STATUSES = new Set(["FINISHED", "IN_PLAY", "PAUSED"]);

exports.handler = async function () {
  try {
    const token = process.env.FOOTBALL_DATA_TOKEN;
    const res = await fetch(
      "https://api.football-data.org/v4/competitions/WC/matches?season=2026",
      { headers: { "X-Auth-Token": token } }
    );
    const data = await res.json();
    const results = (data.matches || [])
      .filter((m) => DONE_STATUSES.has(m.status))
      .map((m) => ({
        home: NAME_MAP[m.homeTeam.name] || m.homeTeam.name,
        away: NAME_MAP[m.awayTeam.name] || m.awayTeam.name,
        sh: m.score.fullTime.home,
        sa: m.score.fullTime.away,
        live: LIVE_STATUSES.has(m.status),
        group: m.stage === "GROUP_STAGE",
      }))
      .filter((r) => r.sh !== null && r.sa !== null);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=120" },
      body: JSON.stringify({ results }),
    };
  } catch (err) {
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ results: [] }) };
  }
};
