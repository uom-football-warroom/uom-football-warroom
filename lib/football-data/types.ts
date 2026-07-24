export type FootballDataArea = {
  id?: number;
  name?: string | null;
  code?: string | null;
  flag?: string | null;
};

export type FootballDataCoach = {
  id?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  nationality?: string | null;
};

export type FootballDataCompetition = {
  id: number;
  name: string;
  code?: string | null;
  type?: string | null;
  emblem?: string | null;
};

export type FootballDataSeason = {
  id?: number;
  startDate?: string;
  endDate?: string;
  currentMatchday?: number | null;
};

export type FootballDataTeam = {
  id: number;
  area?: FootballDataArea | null;
  name: string;
  shortName?: string | null;
  tla?: string | null;
  crest?: string | null;
  address?: string | null;
  website?: string | null;
  founded?: number | null;
  clubColors?: string | null;
  venue?: string | null;
  coach?: FootballDataCoach | null;
  lastUpdated?: string | null;
};

export type FootballDataTeamsResponse = {
  count: number;
  competition: FootballDataCompetition;
  season?: FootballDataSeason;
  teams: FootballDataTeam[];
};

export type FootballDataErrorResponse = {
  message?: string;
  errorCode?: number;
};

export type FootballDataMatchStatus =
  | "SCHEDULED"
  | "TIMED"
  | "IN_PLAY"
  | "PAUSED"
  | "EXTRA_TIME"
  | "PENALTY_SHOOTOUT"
  | "FINISHED"
  | "SUSPENDED"
  | "POSTPONED"
  | "CANCELLED"
  | "AWARDED";

export type FootballDataMatchTeam = {
  id: number | null;
  name?: string | null;
  shortName?: string | null;
  tla?: string | null;
  crest?: string | null;
};

export type FootballDataScoreValue = {
  home: number | null;
  away: number | null;
};

export type FootballDataScore = {
  winner?: string | null;
  duration?: string | null;
  fullTime?: FootballDataScoreValue | null;
  halfTime?: FootballDataScoreValue | null;
  regularTime?: FootballDataScoreValue | null;
  extraTime?: FootballDataScoreValue | null;
  penalties?: FootballDataScoreValue | null;
};

export type FootballDataReferee = {
  id?: number | null;
  name?: string | null;
  type?: string | null;
  nationality?: string | null;
};

export type FootballDataMatch = {
  id: number;
  competition: FootballDataCompetition;
  utcDate: string;
  status: FootballDataMatchStatus;
  matchday?: number | null;
  stage?: string | null;
  group?: string | null;
  venue?: string | null;
  lastUpdated?: string | null;
  homeTeam: FootballDataMatchTeam;
  awayTeam: FootballDataMatchTeam;
  score: FootballDataScore;
  referees?: FootballDataReferee[] | null;
};

export type FootballDataMatchesResponse = {
  filters?: Record<string, unknown>;
  resultSet?: {
    count?: number;
    first?: string | null;
    last?: string | null;
    played?: number;
  };
  competition: FootballDataCompetition;
  matches: FootballDataMatch[];
};

export type FootballDataHeadToHeadResponse = {
  aggregates?: Record<string, unknown>;
  matches: FootballDataMatch[];
};
