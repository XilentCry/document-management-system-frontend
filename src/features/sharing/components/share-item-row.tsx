import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  useRemoveDocumentShare,
  useUpdateShareRole,
} from "@/features/documents/api/mutations";
import { useGetAllShareRoles } from "@/features/sharing/api/queries";
import { TDocumentShare } from "@/features/documents/types/document-share";
import { TItem } from "@/features/items/types/item";
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
  const { mutate: updateShareRoleMutation, isPending: isUpdatingRole } =
    useUpdateShareRole();

  const { data: shareRoles = [] } = useGetAllShareRoles(isOwner);

  const handleRemove = () => {
    removeShareMutation({
      shareId: share.id,
      documentId: item.id,
    });
  };

  const handleRoleChange = (shareRoleId: string) => {
    if (shareRoleId === share.share_role.id) return;
    updateShareRoleMutation({
      shareId: share.id,
      documentId: item.id,
      shareRoleId,
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
          <>
            {isUpdatingRole ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Spinner className="size-4" />
                Updating...
              </div>
            ) : (
              <Select
                value={share.share_role.id}
                onValueChange={(value) => value && handleRoleChange(value)}
                disabled={shareRoles.length === 0}
              >
                <SelectTrigger className="capitalize">
                  <SelectValue>
                    {
                      shareRoles.find((r) => r.id === share.share_role.id)
                        ?.name ?? share.share_role.name
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {shareRoles.map((role) => (
                    <SelectItem
                      key={role.id}
                      value={role.id}
                      className="capitalize"
                      disabled={
                        share.has_organization_unit_access &&
                        role.name === "viewer"
                      }
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleRemove}
              disabled={isRemoving || isUpdatingRole}
            >
              {isRemoving ? (
                <Spinner className="size-4" />
              ) : (
                <X className="size-4" />
              )}
            </Button>
          </>
        ) : (
          <p className="text-muted-foreground text-sm capitalize">
            {share.share_role.name}
          </p>
        )}
      </ItemActions>
    </Item>
  );
}
