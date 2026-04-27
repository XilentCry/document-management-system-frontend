import { TBasicUser } from "@/features/users/types/basic-user";

export type TShareableUser = TBasicUser & {
  has_organization_unit_access: boolean;
};
