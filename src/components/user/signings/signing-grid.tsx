import { TUserSubmission } from "@/types/docuseal-submission";
import { SigningGridItem } from "./signing-grid-item";

export function SigningGrid({ data }: { data: TUserSubmission[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {data.map((item) => (
        <SigningGridItem key={item.id} item={item} />
      ))}
    </div>
  );
}
