import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TOrganizationUnitTree } from "@/types/organization-unit-tree";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function OrganizationUnitTreeNode({
  node,
  selectedIds,
  onToggle,
}: {
  node: TOrganizationUnitTree;
  selectedIds: number[];
  onToggle: (id: number) => void;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = !!node.children?.length;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2 py-1">
        {hasChildren ? (
          <CollapsibleTrigger render={<Button variant="ghost" size="icon" />}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </CollapsibleTrigger>
        ) : (
          <div className="w-6" />
        )}
        {node.id !== 1 && node.id !== 3 && (
          <Checkbox
            checked={selectedIds.includes(node.id)}
            onCheckedChange={() => onToggle(node.id)}
            id={`unit-${node.id}`}
          />
        )}
        <Label htmlFor={`unit-${node.id}`}>{node.name}</Label>
      </div>
      {hasChildren && (
        <div className="ml-4 border-l pl-2">
          <CollapsibleContent>
            {node.children!.map((child) => (
              <OrganizationUnitTreeNode
                key={child.id}
                node={child}
                selectedIds={selectedIds}
                onToggle={onToggle}
              />
            ))}
          </CollapsibleContent>
        </div>
      )}
    </Collapsible>
  );
}
