import { TItem } from "./item";

export type TTrashedItem = TItem & {
  deleted_at: string;
  raw_deleted_at: string;
};
