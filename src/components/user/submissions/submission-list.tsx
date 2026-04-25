import { TDocusealSubmission } from "@/types/docuseal-submission";
import { SubmissionTable } from "./submission-table";

export function SubmissionList({ data }: { data: TDocusealSubmission[] }) {
  return <SubmissionTable data={data} />;
}
