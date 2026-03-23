import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TOrganizationUnitTree } from "@/types/organization-unit-tree";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function SelectableOrganizationUnitTreeNode({
  node,
  selectedId,
  onSelect,
}: {
  node: TOrganizationUnitTree;
  selectedId: number | undefined;
  onSelect: (id: number, name: string) => void;
}) {
  const [open, setOpen] = useState(true);

  const hasChildren = !!node.children?.length;

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
        <Button
          variant="ghost"
          type="button"
          className={`flex-1 justify-start ${
            selectedId === node.id && "bg-muted text-foreground"
          }`}
          onClick={() => onSelect(node.id, node.name)}
        >
          {node.name}
        </Button>
      </div>
      {hasChildren && (
        <div className="ml-4 border-l pl-2">
          <CollapsibleContent>
            {node.children!.map((child) => (
              <SelectableOrganizationUnitTreeNode
                key={child.id}
                node={child}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </CollapsibleContent>
        </div>
      )}
    </Collapsible>
  );
}
