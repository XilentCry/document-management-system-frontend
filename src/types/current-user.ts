export type TCurrentUser = {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  role: "user" | "admin" | "superuser";
  status: "pending" | "approved";
};
