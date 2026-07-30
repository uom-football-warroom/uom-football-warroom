export type Profile = {
  id: string;
  displayName: string;
  username: string;
  email: string;
  role: string;
  tier: string;
  loyaltyPoints?: number;
  memberSince: string;
  accountStatus: "Active" | "Inactive";
  avatarUrl?: string | null;
  favouriteClubs: {
    id: string;
    name: string;
    crestUrl: string | null;
  }[];
  notificationsEnabled: boolean;
};
