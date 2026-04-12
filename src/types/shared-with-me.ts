import { TUserSummary } from "./user-summary";
import { TItem } from "./item";
import { TSharePermission } from "./share-permission";

export type TSharedWithMe = {
  id: string;
  shared_by: TUserSummary;
  share_permissions: TSharePermission[];
  item: TItem;
  created_at: string;
  raw_created_at: string;
};
