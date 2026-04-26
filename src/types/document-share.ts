import { TBasicUser } from "./basic-user";

export type TDocumentShare = {
    id: string;
    shared_with: TBasicUser;
    share_role: {
        id: string;
        name: string;
    };
    has_organization_unit_access: boolean;
};
