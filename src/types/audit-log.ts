import { TCurrentUser } from "./current-user";

type TBaseAuditLog = {
  id: number;
  actor: TCurrentUser;
  created_at: string;
};

type TNamedInParentProps = {
  name: string;
  parent: string;
};

export type TUploadedAuditLog = TBaseAuditLog & {
  action: "uploaded";
  properties: TNamedInParentProps;
};

export type TCreatedAuditLog = TBaseAuditLog & {
  action: "created";
  properties: TNamedInParentProps;
};

export type TRenamedAuditLog = TBaseAuditLog & {
  action: "renamed";
  properties: {
    old_name: string;
    new_name: string;
  };
};

export type TMovedAuditLog = TBaseAuditLog & {
  action: "moved";
  properties: {
    name: string;
    new_parent: string;
  };
};

export type TViewedAuditLog = TBaseAuditLog & {
  action: "viewed";
  properties: TNamedInParentProps;
};

export type TUserStatusUpdatedAuditLog = TBaseAuditLog & {
  action: "user_status_updated";
  properties: {
    name: string;
    new_status: string;
  };
};

export type TUserUpdatedAuditLog = TBaseAuditLog & {
  action: "user_updated";
  properties: {
    name: string;
  };
};

export type TAuditLog =
  | TUploadedAuditLog
  | TCreatedAuditLog
  | TRenamedAuditLog
  | TMovedAuditLog
  | TViewedAuditLog
  | TUserStatusUpdatedAuditLog
  | TUserUpdatedAuditLog;
