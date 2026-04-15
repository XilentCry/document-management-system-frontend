import { TUserStatus } from "@/types/user-status";

export const ROOT_ORGANIZATION_UNIT_SLUG = "office-of-the-board-of-regents";
export const UNIVERSITY_PRESIDENT_SLUG = "office-of-the-university-president";

export const USER_STATUS: { value: TUserStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];
