import { TItem } from "./item";
import { TUser } from "./user";

export type TDocumentVersion = {
    id: string;
    item: Pick<TItem, "id" | "name">;
    version_number: number;
    file_size: number;
    updated_at: string;
    created_by: TUser;
};
