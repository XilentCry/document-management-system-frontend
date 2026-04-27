import { TUserSummary } from "@/features/users/types/user-summary";
import { TItem } from "@/features/items/types/item";

export type TSharedWithMe = {
  id: string;
  shared_by: TUserSummary;
  item: TItem;
  created_at: string;
  raw_created_at: string;
};
