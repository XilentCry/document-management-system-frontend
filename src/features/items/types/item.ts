import { TBasicUser } from "@/features/users/types/basic-user";
import { TUserSummary } from "@/features/users/types/user-summary";

export type TItem = {
  id: string;
  name: string;
  type?: "pdf" | "folder";
  is_folder: boolean;
  is_locked: boolean;
  parent_item_id: string | null;
  owner: TUserSummary;
  organization_unit_id: string;
  classification: string;
  location: string;
  current_version: {
    id: string;
    item_id: string;
    file_size: number;
    file_path: string;
    version_number?: number;
  } | null;
  current_user_share?: {
    role: "viewer" | "editor" | null;
    permissions: string[];
    can_download: boolean;
  } | null;
  created_at?: string;
  updated_at: string;
  updated_by: TBasicUser;
  opened_at?: string | null;
  opened_by?: TBasicUser | null;
};
