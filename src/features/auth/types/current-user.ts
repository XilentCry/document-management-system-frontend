export type TCurrentUser = {
  id: string;
  email: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  role: "user" | "admin" | "superuser";
  lastLogin: string | null;
  lastFailedLogin: string | null;
  currentOrganizationUnitId?: string;
  currentOrganizationUnitName?: string;
};
