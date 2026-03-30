import { TCurrentUser } from "./current-user";
import { TSharePermission } from "./share-permission";

export type TItem = {
  id: string;
  name: string;
  type?: "pdf" | "folder";
  is_folder: boolean;
  parent_item_id: string | null;
  owner: TCurrentUser;
  organization_unit_id: string;
  classification: string;
  location: string;
  current_version: {
    id: string;
    item_id: string;
    file_size: number;
    file_path: string;
  } | null;
  share_permissions: TSharePermission[] | null;
  created_at?: string;
  updated_at: string;
};
