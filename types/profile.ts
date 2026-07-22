export type Profile = {
  id: string;
  displayName: string;
  username: string;
  email: string;
  role: "Supporter";
  tier: "New Fan";
  memberSince: string;
  accountStatus: "Active" | "Inactive";
  favouriteClubId?: string;
  notificationsEnabled: boolean;
};
