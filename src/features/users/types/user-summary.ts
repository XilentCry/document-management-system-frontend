import { TBasicUser } from "./basic-user";

export type TUserSummary = {
  role: "user" | "admin" | "superuser";
  status: "pending" | "active" | "inactive" | "suspended";
} & TBasicUser;
