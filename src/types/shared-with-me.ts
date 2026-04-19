import { TUserSummary } from "./user-summary";
import { TItem } from "./item";

export type TSharedWithMe = {
  id: string;
  shared_by: TUserSummary;
  item: TItem;
  created_at: string;
  raw_created_at: string;
};
