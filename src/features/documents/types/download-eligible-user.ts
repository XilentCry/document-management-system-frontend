export type TDownloadEligibleUser = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  can_download: boolean;
};
