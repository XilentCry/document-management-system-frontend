import { TBasicUser } from "./basic-user";

export type TUserSummary = {
  role: "user" | "admin" | "superuser";
  status: "pending" | "approved";
} & TBasicUser;
