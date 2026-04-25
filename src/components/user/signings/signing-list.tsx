import { TUserSubmission } from "@/types/docuseal-submission";
import { SigningTable } from "./signing-table";

export function SigningList({ data }: { data: TUserSubmission[] }) {
  return (
    <SigningTable data={data} />
  );
}
