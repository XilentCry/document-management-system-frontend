import { TCurrentUser } from "./current-user";
import { TItem } from "./item";
import { TSharePermission } from "./share-permission";

export type TSharedWithMe = {
  id: number;
  shared_by: TCurrentUser;
  share_permissions: TSharePermission[];
  item: TItem;
  created_at: string;
};
