import { TCurrentUser } from "./current-user";

export type TUser = {
  created_at: string;
  updated_at: string;
} & TCurrentUser;
