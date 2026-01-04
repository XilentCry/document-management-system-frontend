export type TCurrentUser = {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  role: "User" | "Admin";
  status: "Pending" | "Approved";
};
