export type Club = {
  id: string;
  name: string;
  code: string;
  logo: string;
  country: string;
  competition: string;
  supporters: string;
  stadium?: string;
  founded?: number;
  description?: string;
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
};
