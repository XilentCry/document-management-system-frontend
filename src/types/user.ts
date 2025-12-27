import { TCurrentUser } from "./current-user";

export type TUser = {
  status: "Pending" | "Approved" | "Rejected";
  created_at: string;
  updated_at: string;
} & TCurrentUser;
