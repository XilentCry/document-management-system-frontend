import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TOrganizationUnitTree } from "@/types/organization-unit-tree";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DialogClose } from "../../ui/dialog";
import { useCurrentUser } from "@/services/user/queries";
import { useOrganizationUnitStore } from "@/stores/organization-unit-store";

export function UserOrganizationUnitTreeNode({
  node,
}: {
  node: TOrganizationUnitTree;
}) {
  const [open, setOpen] = useState(true);

  const hasChildren = !!node.children?.length;
  const { data: currentUser } = useCurrentUser();
  const storeOrganizationUnitId = useOrganizationUnitStore(
    (state) => state.currentOrganizationUnitId,
  );
  const currentOrganizationUnitId = storeOrganizationUnitId ?? currentUser?.currentOrganizationUnitId ?? null;

  const router = useRouter();

  const handleSelectOrganizationUnit = (id: string) => {
    router.push(`/drive/organizational-drive/${id}`);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        {hasChildren ? (
          <CollapsibleTrigger render={<Button variant="ghost" size="icon" />}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </CollapsibleTrigger>
        ) : (
          <div className="w-6" />
        )}
        <DialogClose
          render={
            <Button
              variant="ghost"
              className={`flex-1 justify-start ${
                currentOrganizationUnitId === node.id &&
                "bg-muted text-foreground"
              }`}
              onClick={() => handleSelectOrganizationUnit(node.id)}
            />
          }
        >
          {node.name}
        </DialogClose>
      </div>
      {hasChildren && (
        <div className="ml-4 border-l pl-2">
          <CollapsibleContent>
            {node.children!.map((child) => (
              <UserOrganizationUnitTreeNode key={child.id} node={child} />
            ))}
          </CollapsibleContent>
        </div>
      )}
    </Collapsible>
  );
}
