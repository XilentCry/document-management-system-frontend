import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TOrganizationUnit } from "@/types/organization-unit";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DialogClose } from "../ui/dialog";

export function UserOrganizationUnitTreeNode({
  node,
}: {
  node: Pick<
    TOrganizationUnit,
    "id" | "name" | "parent_organization_unit_id" | "children"
  >;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = !!node.children?.length;

  const router = useRouter();

  const handleSelectOrganizationUnit = (id: number) => {
    router.push(`/drive/department-drive/${id}`);
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
              className="flex-1 justify-start"
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
