import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { useRemoveDocumentShare } from "@/services/documents/mutations";
import { TDocumentShare } from "@/types/document-share";
import { TItem } from "@/types/item";
import { X } from "lucide-react";

export function ShareItemRow({
  share,
  item,
  isOwner,
}: {
  share: TDocumentShare;
  item: TItem;
  isOwner: boolean;
}) {
  const { mutate: removeShareMutation, isPending: isRemoving } =
    useRemoveDocumentShare();

  const handleRemove = () => {
    removeShareMutation({
      shareId: share.id,
      documentId: item.id,
    });
  };

  return (
    <Item size="xs">
      <ItemContent className="min-w-0">
        <ItemTitle className="block w-auto truncate">
          {share.shared_with.first_name} {share.shared_with.middle_name ?? ""}{" "}
          {share.shared_with.last_name}
        </ItemTitle>
        <ItemDescription>{share.shared_with.email}</ItemDescription>
      </ItemContent>
      <ItemActions>
        {isOwner ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <Spinner className="size-4" />
            ) : (
              <X className="size-4" />
            )}
          </Button>
        ) : (
          <p className="text-muted-foreground text-sm">Shared</p>
        )}
      </ItemActions>
    </Item>
  );
}
