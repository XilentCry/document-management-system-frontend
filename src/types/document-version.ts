import { TItem } from "./item";
import { TUser } from "./user";

export type TDocumentVersion = {
    id: string;
    file_name: string;
    item: Pick<TItem, "id" | "name">;
    version_number: number;
    file_size: number;
    created_at: string;
    created_by: TUser;
};
