import { TCurrentUser } from "./current-user";
import { TItem } from "./item";
import { TSharePermission } from "./share-permission";

export type TSharedWithMe = {
  id: number;
  sharedBy: TCurrentUser;
  sharePermissions: TSharePermission[];
  item: TItem;
  created_at: string;
};
