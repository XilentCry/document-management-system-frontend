import { TBasicUser } from "./basic-user";

export type TDocumentShare = {
    id: string;
    shared_with: TBasicUser;
};
