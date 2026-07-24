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
  externalId: number | null;
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

export type FixtureStatus =
  | "SCHEDULED"
  | "LIVE"
  | "COMPLETED"
  | "POSTPONED"
  | "CANCELLED";

export type ApiFixture = {
  id: string;
  externalId: number | null;
  competition: string;
  competitionCode: string | null;
  matchday: number | null;
  homeClubId: string;
  awayClubId: string;
  startTime: string;
  venue: string | null;
  status: FixtureStatus;
  homeScore: number | null;
  awayScore: number | null;
  referee: string | null;
  createdAt: string;
  updatedAt: string;
  homeClub: ApiClub;
  awayClub: ApiClub;
};

export type FixturesApiResponse = {
  success: boolean;
  data?: ApiFixture[];
  message?: string;
};

export type FixtureDetailsApiResponse = {
  success: boolean;
  data?: ApiFixture;
  message?: string;
};

type ApiFixtureFields = Omit<ApiFixture, "homeClub" | "awayClub">;

export type ApiClubHomeFixture = ApiFixtureFields & {
  awayClub: ApiClub;
};

export type ApiClubAwayFixture = ApiFixtureFields & {
  homeClub: ApiClub;
};

export type ApiClubDetails = ApiClub & {
  homeFixtures: ApiClubHomeFixture[];
  awayFixtures: ApiClubAwayFixture[];
};

export type ClubDetailsApiResponse = {
  success: boolean;
  data?: ApiClubDetails;
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
  status: FixtureStatus;
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
