import { TUserSummary } from "./user-summary";

export type TUser = {
  created_at: string;
  updated_at: string;
} & TUserSummary;
