import { TCurrentUser } from "./current-user";

export type TItem = {
  id: number;
  name: string;
  is_folder: boolean;
  parent_item_id: number | null;
  owner: TCurrentUser;
  organization_unit_id: number;
  classification: string;
  updated_at: string;
};
