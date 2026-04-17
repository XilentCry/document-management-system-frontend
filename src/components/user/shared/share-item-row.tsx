import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { X } from "lucide-react";
import { useUpdateDocumentShareRole, useRemoveDocumentShare } from "@/services/documents/mutations";
import { TDocumentShare } from "@/types/document-share";
import { TItem } from "@/types/item";
import { TShareRole } from "@/types/share-role";

export function ShareItemRow({
  share,
  item,
  shareRoles,
  isOwner,
}: {
  share: TDocumentShare;
  item: TItem;
  shareRoles: TShareRole[];
  isOwner: boolean;
}) {
  const {
    mutate: updateShareRoleMutation,
    isPending: isUpdatingRole,
    variables: updateVariables,
  } = useUpdateDocumentShareRole();
  const {
    mutate: removeShareMutation,
    isPending: isRemovingShare,
    variables: removeShareVariables,
  } = useRemoveDocumentShare();

  return (
    <div key={share.id}>
      <Item>
        <ItemContent className="min-w-0">
          <ItemTitle className="block w-auto truncate">
            {share.shared_with.first_name} {share.shared_with.middle_name ?? ""}{" "}
            {share.shared_with.last_name}
          </ItemTitle>
          <ItemDescription className="truncate">
            {share.shared_with.email}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          {isOwner ? (
            <>
              <Select
                value={share.share_role.id}
                disabled={
                  (isUpdatingRole && updateVariables?.shareId === share.id) ||
                  (isRemovingShare && removeShareVariables?.shareId === share.id)
                }
                onValueChange={(value) => {
                  updateShareRoleMutation({
                    shareId: share.id,
                    shareRoleId: value as string,
                    documentId: item.id,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue>
                    {isUpdatingRole && updateVariables?.shareId === share.id ? (
                      <div className="flex items-center gap-2">
                        <Spinner className="size-4" />
                        <span className="text-muted-foreground animate-pulse">
                          Updating...
                        </span>
                      </div>
                    ) : (
                      share.share_role.name
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {shareRoles.map((role) => (
                    <SelectItem
                      key={role.id}
                      value={role.id}
                      disabled={role.id === share.share_role.id}
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={
                  (isUpdatingRole && updateVariables?.shareId === share.id) ||
                  (isRemovingShare && removeShareVariables?.shareId === share.id)
                }
                onClick={() => {
                  removeShareMutation({
                    shareId: share.id,
                    documentId: item.id,
                  });
                }}
              >
                {isRemovingShare && removeShareVariables?.shareId === share.id ? (
                  <Spinner className="size-4" />
                ) : (
                  <X />
                )}
              </Button>
            </>
          ) : (
            <p className="text-muted-foreground capitalize text-sm">
              {share.share_role.name}
            </p>
          )}
        </ItemActions>
      </Item>
    </div>
  );
}
