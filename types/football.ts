export type Club = {
  id: string;
  name: string;
  code: string;
  logo: string;
  country: string;
  competition: string;
  supporters: string;
  stadium?: string;
  stadiumCapacity?: number;
  founded?: number;
  description?: string;
  comparison?: ClubComparison;
};

export type ApiClub = {
  id: string;
  externalId: number;
  slug: string;
  name: string;
  shortName: string | null;
  tla: string | null;
  crestUrl: string | null;
  country: string | null;
  competition: string | null;
  stadium: string | null;
  stadiumCapacity: number | null;
  founded: number | null;
  manager: string | null;
  websiteUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClubsApiResponse = {
  success: boolean;
  data?: ApiClub[];
  message?: string;
};

export type ClubComparison = {
  leaguePosition?: number;
  averageGoals?: number;
  averagePossession?: number;
  recentForm?: Array<"W" | "D" | "L">;
};

export type Fixture = {
  id: string;
  competition: string;
  homeClub: Club;
  awayClub: Club;
  date: string;
  dateISO?: string;
  time: string;
  venue: string;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "POSTPONED" | "CANCELLED";
  homeScore?: number;
  awayScore?: number;
  matchMinute?: number;
  homeLineup?: Lineup;
  awayLineup?: Lineup;
  headToHeadResults?: HeadToHeadResult[];
};

export type Lineup = {
  starting: string[];
  substitutes?: string[];
};

export type HeadToHeadResult = {
  homeOutcome: "W" | "D" | "L";
  score: string;
};
