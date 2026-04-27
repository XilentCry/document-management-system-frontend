import { TItem } from "@/features/items/types/item";

export type TTrashedItem = TItem & {
  deleted_at: string;
  raw_deleted_at: string;
};
