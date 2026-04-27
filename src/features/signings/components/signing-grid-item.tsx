import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { formatDate } from "@/lib/format-date";
import { TUserSubmission } from "@/features/submissions/types/docuseal-submission";
import Image from "next/image";
import { SigningActions } from "./signing-actions";
import { SigningStatusBadge } from "./signing-status-badge";

interface SigningGridItemProps {
  item: TUserSubmission;
}

export function SigningGridItem({ item }: SigningGridItemProps) {
  return (
    <Item variant="muted" size="xs">
      <ItemMedia>
        <Image src="/pdf.svg" alt="PDF" width={16} height={16} />
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle className="block w-auto truncate">
          {item.template.name}
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <SigningActions item={item} />
      </ItemActions>
      <ItemFooter className="min-w-0">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <SigningStatusBadge status={item.status} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 truncate">{item.role}</p>
            <p className="shrink-0">{formatDate(item.created_at)}</p>
          </div>
        </div>
      </ItemFooter>
    </Item>
  );
}
