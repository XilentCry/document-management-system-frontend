import { TBasicUser } from "./basic-user";

export type TShareableUser = TBasicUser & {
  has_organization_unit_access: boolean;
};
