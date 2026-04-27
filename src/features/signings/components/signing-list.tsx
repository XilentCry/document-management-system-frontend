import { TUserSubmission } from "@/features/submissions/types/docuseal-submission";
import { SigningTable } from "./signing-table";

export function SigningList({ data }: { data: TUserSubmission[] }) {
  return (
    <SigningTable data={data} />
  );
}
