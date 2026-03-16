import { TCurrentUser } from "./current-user";
import { TSharePermission } from "./share-permission";

export type TItem = {
  id: number;
  name: string;
  type?: "pdf" | "folder";
  is_folder: boolean;
  parent_item_id: number | null;
  owner: TCurrentUser;
  organization_unit_id: number;
  classification: string;
  location: string;
  current_version: {
    id: number;
    item_id: number;
    file_size: number;
    file_path: string;
  } | null;
  share_permissions: TSharePermission[] | null;
  created_at?: string;
  updated_at: string;
};
