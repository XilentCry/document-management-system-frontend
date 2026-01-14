import { TCurrentUser } from "./current-user";

export type TFolder = {
  id: number;
  name: string;
  parent_folder_id: number;
  owner: TCurrentUser;
  organization_unit_id: number;
  children?: TFolder[];
  created_at: string;
  updated_at: string;
};
