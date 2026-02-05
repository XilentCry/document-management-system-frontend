import { TCurrentUser } from "./current-user";

type TBaseActivity = {
  id: number;
  actor: TCurrentUser;
  created_at: string;
};

type TNamedInParentProps = {
  name: string;
  parent: string;
};

export type TUploadedActivity = TBaseActivity & {
  action: "uploaded";
  properties: TNamedInParentProps;
};

export type TCreatedActivity = TBaseActivity & {
  action: "created";
  properties: TNamedInParentProps;
};

export type TRenamedActivity = TBaseActivity & {
  action: "renamed";
  properties: {
    old_name: string;
    new_name: string;
  };
};

export type TMovedActivity = TBaseActivity & {
  action: "moved";
  properties: {
    name: string;
    new_parent: string;
  };
};

export type TViewedActivity = TBaseActivity & {
  action: "viewed";
  properties: TNamedInParentProps;
};

export type TActivity =
  | TUploadedActivity
  | TCreatedActivity
  | TRenamedActivity
  | TMovedActivity
  | TViewedActivity;
