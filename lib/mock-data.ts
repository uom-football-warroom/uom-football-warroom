// Shared mock football data placeholder.
import type { Club, Fixture } from "@/types/football";
import type { Profile } from "@/types/profile";

export const mockProfile: Profile = {
  id: "demo-supporter",
  displayName: "Demo Supporter",
  username: "demo_supporter",
  email: "supporter@example.com",
  role: "Supporter",
  tier: "New Fan",
  memberSince: "January 2026",
  accountStatus: "Active",
  favouriteClubs: [],
  notificationsEnabled: true,
};

export const clubs: Club[] = [
  {
    id: "arsenal",
    name: "Arsenal",
    code: "ARS",
    logo: "/images/clubs/arsenal.png",
    country: "England",
    competition: "Premier League",
    supporters: "1.2M",
    stadium: "Emirates Stadium",
    stadiumCapacity: 60704,
    founded: 1886,
    description:
      "Arsenal is a historic English football club from North London, known for generations of passionate supporters and a proud domestic tradition.",
    comparison: {
      leaguePosition: 2,
      averageGoals: 2.4,
      averagePossession: 58,
      recentForm: ["W", "W", "D", "W", "L"],
    },
  },
  {
    id: "liverpool",
    name: "Liverpool",
    code: "LIV",
    logo: "/images/clubs/liverpool.png",
    country: "England",
    competition: "Premier League",
    supporters: "2.5M",
    stadium: "Anfield",
    stadiumCapacity: 61276,
    founded: 1892,
    description:
      "Liverpool is an English football club with a celebrated history, a global supporter community, and a famous matchday home at Anfield.",
    comparison: {
      leaguePosition: 1,
      averageGoals: 2.7,
      averagePossession: 61,
      recentForm: ["W", "W", "W", "D", "W"],
    },
  },
  {
    id: "barcelona",
    name: "FC Barcelona",
    code: "BAR",
    logo: "/images/clubs/barcelona.png",
    country: "Spain",
    competition: "La Liga",
    supporters: "4.1M",
    stadium: "Camp Nou",
    stadiumCapacity: 99354,
    founded: 1899,
    description:
      "FC Barcelona is a historic Catalan club with a worldwide following, a celebrated academy tradition, and deep roots in the city of Barcelona.",
    comparison: {
      leaguePosition: 1,
      averageGoals: 2.6,
      averagePossession: 64,
      recentForm: ["W", "W", "D", "W", "W"],
    },
  },
  {
    id: "real-madrid",
    name: "Real Madrid",
    code: "RMA",
    logo: "/images/clubs/real-madrid.png",
    country: "Spain",
    competition: "La Liga",
    supporters: "5.8M",
    stadium: "Santiago Bernabéu",
    stadiumCapacity: 81044,
    founded: 1902,
    description:
      "Real Madrid is a Spanish football club from the capital, supported around the world and renowned for a long history of domestic and European honours.",
    comparison: {
      leaguePosition: 2,
      averageGoals: 2.5,
      averagePossession: 59,
      recentForm: ["W", "D", "W", "W", "W"],
    },
  },
  {
    id: "bayern-munich",
    name: "Bayern Munich",
    code: "BAY",
    logo: "/images/clubs/bayern-munich.png",
    country: "Germany",
    competition: "Bundesliga",
    supporters: "1.9M",
    stadium: "Allianz Arena",
    stadiumCapacity: 75024,
    founded: 1900,
    description:
      "Bayern Munich is a German football club with a proud winning tradition, a vibrant home in Munich, and one of the country's largest supporter communities.",
    comparison: {
      leaguePosition: 1,
      averageGoals: 2.8,
      averagePossession: 62,
      recentForm: ["W", "W", "W", "D", "W"],
    },
  },
  {
    id: "inter-milan",
    name: "Inter Milan",
    code: "INT",
    logo: "/images/clubs/inter-milan.png",
    country: "Italy",
    competition: "Serie A",
    supporters: "1.6M",
    stadium: "San Siro",
    stadiumCapacity: 75817,
    founded: 1908,
    description:
      "Inter Milan is an Italian football club with a rich history, loyal supporters, and an enduring connection to the city of Milan and the San Siro.",
    comparison: {
      leaguePosition: 2,
      averageGoals: 2.2,
      averagePossession: 57,
      recentForm: ["W", "D", "W", "L", "W"],
    },
  },
];

export const fixtures: Fixture[] = [
  {
    id: "real-barcelona",
    competition: "La Liga",
    homeClub: clubs[3],
    awayClub: clubs[2],
    date: "Saturday, 18 October",
    dateISO: "2026-10-18",
    time: "21:00",
    venue: "Santiago Bernabéu",
    status: "SCHEDULED",
    headToHeadResults: [
      { homeOutcome: "W", score: "3–2" },
      { homeOutcome: "L", score: "1–2" },
      { homeOutcome: "W", score: "2–1" },
      { homeOutcome: "D", score: "1–1" },
      { homeOutcome: "W", score: "3–1" },
    ],
  },
  {
    id: "arsenal-liverpool",
    competition: "Premier League",
    homeClub: clubs[0],
    awayClub: clubs[1],
    date: "Sunday, 19 October",
    dateISO: "2026-10-19",
    time: "17:30",
    venue: "Emirates Stadium",
    status: "LIVE",
    homeScore: 2,
    awayScore: 1,
    matchMinute: 78,
    headToHeadResults: [
      { homeOutcome: "W", score: "2–1" },
      { homeOutcome: "D", score: "1–1" },
      { homeOutcome: "L", score: "0–3" },
      { homeOutcome: "W", score: "3–2" },
      { homeOutcome: "D", score: "0–0" },
    ],
  },
  {
    id: "inter-bayern",
    competition: "Champions League",
    homeClub: clubs[5],
    awayClub: clubs[4],
    date: "Wednesday, 22 October",
    dateISO: "2026-10-22",
    time: "20:45",
    venue: "San Siro",
    status: "SCHEDULED",
    headToHeadResults: [
      { homeOutcome: "D", score: "1–1" },
      { homeOutcome: "L", score: "0–2" },
      { homeOutcome: "W", score: "2–0" },
    ],
  },
  {
    id: "arsenal-real-result",
    competition: "Champions League",
    homeClub: clubs[0],
    awayClub: clubs[3],
    date: "Wednesday, 8 October",
    dateISO: "2026-10-08",
    time: "20:00",
    venue: "Emirates Stadium",
    status: "COMPLETED",
    homeScore: 2,
    awayScore: 1,
  },
  {
    id: "liverpool-barcelona-result",
    competition: "Champions League",
    homeClub: clubs[1],
    awayClub: clubs[2],
    date: "Tuesday, 7 October",
    dateISO: "2026-10-07",
    time: "20:00",
    venue: "Anfield",
    status: "COMPLETED",
    homeScore: 2,
    awayScore: 2,
  },
  {
    id: "bayern-inter-result",
    competition: "Champions League",
    homeClub: clubs[4],
    awayClub: clubs[5],
    date: "Wednesday, 1 October",
    dateISO: "2026-10-01",
    time: "20:00",
    venue: "Allianz Arena",
    status: "COMPLETED",
    homeScore: 3,
    awayScore: 1,
  },
];

export function findClubById(id: string) {
  return clubs.find((club) => club.id === id);
}

export function getFixturesForClub(id: string) {
  return fixtures.filter(
    (fixture) =>
      fixture.homeClub.id === id || fixture.awayClub.id === id,
  );
}

export function findFixtureById(id: string) {
  return fixtures.find((fixture) => fixture.id === id);
}
