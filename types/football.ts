export type Club = {
  id: string;
  name: string;
  code: string;
  country: string;
  competition: string;
  supporters: string;
};

export type Fixture = {
  id: string;
  competition: string;
  homeClub: Club;
  awayClub: Club;
  date: string;
  time: string;
  venue: string;
  status: "SCHEDULED" | "LIVE" | "COMPLETED";
};
