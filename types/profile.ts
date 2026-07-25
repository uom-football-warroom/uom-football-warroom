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
  favouriteClub?: {
    id: string;
    name: string;
    crestUrl: string | null;
  } | null;
  favouriteClubId?: string;
  notificationsEnabled: boolean;
};
