import { TCurrentUser } from "./current-user";
import { TItem } from "./item";

export type TSharedWithMe = {
  id: number;
  sharedBy: TCurrentUser;
  item: TItem;
  created_at: string;
};
