import { TBasicUser } from "./basic-user";

export type TCurrentUser = {
  role: "user" | "admin" | "superuser";
  status: "pending" | "approved";
} & TBasicUser;
