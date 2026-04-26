export type TUserSubmission = {
  id: number;
  submission_id: number;
  uuid: string;
  slug: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  status: 'awaiting' | 'sent' | 'opened' | 'completed' | 'declined';
  external_id: string | null;
  sent_at: string | null;
  opened_at: string | null;
  completed_at: string | null;
  declined_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
  preferences: Record<string, unknown>;
  template: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  submission_events: {
    id: number;
    submitter_id: number;
    event_type: string;
    event_timestamp: string;
    data: Record<string, unknown>;
  }[];
  values: { field: string; value: unknown }[];
  documents: { name: string; url: string }[];
};

export type TDocusealSubmission = {
  id: number;
  name: string | null;
  source: string;
  submitters_order: string;
  slug: string;
  status: 'pending' | 'completed' | 'declined' | 'expired' | 'sent';
  audit_log_url: string | null;
  combined_document_url: string | null;
  expire_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  submitters: TDocusealSubmitter[];
  template: TDocusealTemplate;
  created_by_user: TDocusealCreatedByUser;
};

export type TDocusealSubmitter = {
  id: number;
  submission_id: number;
  uuid: string;
  email: string;
  slug: string;
  sent_at: string | null;
  opened_at: string | null;
  completed_at: string | null;
  declined_at: string | null;
  created_at: string;
  updated_at: string;
  name: string | null;
  phone: string | null;
  status: string;
  role: string;
  external_id?: string | null;
  metadata: Record<string, unknown>;
  preferences: Record<string, unknown>;
};

export type TDocusealTemplate = {
  id: number;
  name: string;
  external_id: string | null;
  folder_name: string;
  created_at: string;
  updated_at: string;
};

export type TDocusealCreatedByUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};
