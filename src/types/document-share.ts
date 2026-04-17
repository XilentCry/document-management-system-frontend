import { TBasicUser } from "./basic-user";
import { TShareRole } from "./share-role";

export type TDocumentShare = {
    id: string;
    shared_with: TBasicUser;
    share_role: TShareRole;
};
