import { TUserSummary } from "./user-summary";

type TBaseAuditLog = {
  id: string;
  actor: TUserSummary;
  subject: string;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
};

type TNamedInParentProps = {
  name: string;
  parent: string;
};

export type TUploadedAuditLog = TBaseAuditLog & {
  action: "document.upload";
  properties: TNamedInParentProps;
};

export type TCreatedAuditLog = TBaseAuditLog & {
  action: "folder.create";
  properties: TNamedInParentProps;
};

export type TEditedAuditLog = TBaseAuditLog & {
  action: "document.edit";
  properties: TNamedInParentProps & {
    removed_oldest_version?: number;
  };
};

export type TRenamedAuditLog = TBaseAuditLog & {
  action: "item.rename";
  properties: {
    old_name: string;
    new_name: string;
  };
};

export type TMovedAuditLog = TBaseAuditLog & {
  action: "item.move";
  properties: {
    name: string;
    new_parent: string;
  };
};

export type TViewedAuditLog = TBaseAuditLog & {
  action: "document.view";
  properties: TNamedInParentProps;
};

export type TUserStatusUpdatedAuditLog = TBaseAuditLog & {
  action: "user.update_status";
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
  action: "user.update";
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
  action: "document.share";
  properties: {
    name: string;
    shared_with: string[];
    parent: string;
  };
};

export type TAdminInvitedAuditLog = TBaseAuditLog & {
  action: "admin.invite";
  properties: {
    name: string;
    email: string;
  };
};

export type TAdminReinvitedAuditLog = TBaseAuditLog & {
  action: "admin.reinvite";
  properties: {
    name: string;
    email: string;
  };
};

export type TOrganizationUnitCreatedAuditLog = TBaseAuditLog & {
  action: "organization_unit.create";
  properties: {
    name: string;
    parent: string | null;
  };
};

export type TOrganizationUnitUpdatedAuditLog = TBaseAuditLog & {
  action: "organization_unit.update";
  properties: {
    name: string;
    changed_fields: {
      name?: ChangedField<string>;
      parent_organization_unit?: ChangedField<string | null>;
    };
  };
};

export type TClassificationChangedAuditLog = TBaseAuditLog & {
  action: "document.change_classification";
  properties: {
    name: string;
    old_classification: string;
    new_classification: string;
  };
};

export type TDocumentVersionDeletedLimitAuditLog = TBaseAuditLog & {
  action: "document.version_deleted_limit";
  properties: TNamedInParentProps & {
    version_number: number;
  };
};


export type TRemoveDocumentShareAuditLog = TBaseAuditLog & {
  action: "document.remove_share";
  properties: {
    name: string;
    removed_user: string;
  };
};

export type TUpdateShareRoleAuditLog = TBaseAuditLog & {
  action: "document.update_share_role";
  properties: {
    name: string;
    shared_with: string;
    previous_role: string | null;
    new_role: string;
  };
};

export type TTrashDocumentAuditLog = TBaseAuditLog & {
  action: "document.trash";
  properties: {
    name: string;
  };
};

export type TRestoreDocumentAuditLog = TBaseAuditLog & {
  action: "document.restore";
  properties: {
    name: string;
  };
};

export type TForceDeleteDocumentAuditLog = TBaseAuditLog & {
  action: "document.force_delete";
  properties: {
    name: string;
  };
};

export type TGrantDownloadAuditLog = TBaseAuditLog & {
  action: "document.grant_download";
  properties: {
    name: string;
    shared_with: string;
  };
};

export type TRevokeDownloadAuditLog = TBaseAuditLog & {
  action: "document.revoke_download";
  properties: {
    name: string;
    shared_with: string;
  };
};

export type TLockItemAuditLog = TBaseAuditLog & {
  action: "item.lock";
  properties: {
    name: string;
  };
};

export type TUnlockItemAuditLog = TBaseAuditLog & {
  action: "item.unlock";
  properties: {
    name: string;
  };
};

export type TDocumentDownloadAuditLog = TBaseAuditLog & {
  action: "document.download";
  properties: {
    name: string;
    parent: string | null;
  };
};

export type TDocumentDownloadVersionAuditLog = TBaseAuditLog & {
  action: "document.download_version";
  properties: {
    name: string;
    file_name: string;
    version_number: number;
  };
};

export type TDocumentSubmissionCreatedAuditLog = TBaseAuditLog & {
  action: "document.submission_created";
  properties: {
    name: string;
    docuseal_id: number;
    submitters_count: number;
  };
};

export type TDocumentSignedCompletedAuditLog = TBaseAuditLog & {
  action: "document.signed_completed";
  properties: {
    docuseal_id: number;
    version_number: number;
    removed_oldest_version?: number;
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
  | TAdminReinvitedAuditLog
  | TOrganizationUnitCreatedAuditLog
  | TOrganizationUnitUpdatedAuditLog
  | TClassificationChangedAuditLog
  | TDocumentVersionDeletedLimitAuditLog
  | TRemoveDocumentShareAuditLog
  | TUpdateShareRoleAuditLog
  | TTrashDocumentAuditLog
  | TRestoreDocumentAuditLog
  | TForceDeleteDocumentAuditLog
  | TGrantDownloadAuditLog
  | TRevokeDownloadAuditLog
  | TLockItemAuditLog
  | TUnlockItemAuditLog
  | TDocumentDownloadAuditLog
  | TDocumentDownloadVersionAuditLog
  | TDocumentSubmissionCreatedAuditLog
  | TDocumentSignedCompletedAuditLog;
