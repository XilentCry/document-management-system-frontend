import { TCurrentUser } from "./current-user";

export type TItem = {
  id: number;
  name: string;
  is_folder: boolean;
  parent_item_id: number | null;
  owner: TCurrentUser;
  organization_unit_id: number;
  classification: string;
  current_version: {
    id: number;
    item_id: number;
    file_size: number;
    file_path: string;
    version_number: number;
  } | null;
  created_at?: string;
  updated_at: string;
};
