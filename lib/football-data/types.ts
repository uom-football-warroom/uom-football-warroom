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