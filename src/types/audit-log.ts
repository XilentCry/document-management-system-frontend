import { TCurrentUser } from "./current-user";

type TBaseAuditLog = {
  id: number;
  actor: TCurrentUser;
  subject: string;
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

export type TEditedAuditLog = TBaseAuditLog & {
  action: "edited";
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

type ChangedField<T> = {
  old: T;
  new: T;
};

export type TUserUpdatedAuditLog = TBaseAuditLog & {
  action: "user_updated";
  properties: {
    name: string;
    changed_fields: {
      first_name?: ChangedField<string>;
      middle_name?: ChangedField<string | null>;
      last_name?: ChangedField<string>;
      email?: ChangedField<string>;
      organization_units?: ChangedField<string[]>;
    };
  };
};

export type TSharedAuditLog = TBaseAuditLog & {
  action: "shared";
  properties: {
    name: string;
    shared_with: string[];
    parent: string;
  };
};

export type TAdminInvitedAuditLog = TBaseAuditLog & {
  action: "admin_invited";
  properties: {
    name: string;
    email: string;
  };
};

export type TAdminReinvitedAuditLog = TBaseAuditLog & {
  action: "admin_reinvited";
  properties: {
    name: string;
    email: string;
  };
};

export type TAuditLog =
  | TUploadedAuditLog
  | TCreatedAuditLog
  | TEditedAuditLog
  | TRenamedAuditLog
  | TMovedAuditLog
  | TViewedAuditLog
  | TUserStatusUpdatedAuditLog
  | TUserUpdatedAuditLog
  | TSharedAuditLog
  | TAdminInvitedAuditLog
  | TAdminReinvitedAuditLog;
