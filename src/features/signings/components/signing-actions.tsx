import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TUserSubmission } from "@/features/submissions/types/docuseal-submission";
import { EllipsisVertical, FilePenLine } from "lucide-react";
import { useState } from "react";
import { SigningFormViewer } from "@/features/viewer/components/signing-form-viewer";

interface SigningActionsProps {
  item: TUserSubmission;
}

export function SigningActions({ item }: SigningActionsProps) {
  const [isSigningOpen, setIsSigningOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => e.stopPropagation()}
            />
          }
        >
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-72"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsSigningOpen(true);
            }}
          >
            <FilePenLine />
            Sign
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SigningFormViewer
        isOpen={isSigningOpen}
        onClose={() => setIsSigningOpen(false)}
        token={item.slug}
        documentName={item.template.name}
      />
    </>
  );
}
