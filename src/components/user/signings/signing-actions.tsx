import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TUserSubmission } from "@/types/docuseal-submission";
import { EllipsisVertical, FilePenLine } from "lucide-react";
import { useState } from "react";
import { SigningFormViewer } from "../shared/signing-form-viewer";

interface SigningActionsProps {
  item: TUserSubmission;
}

export function SigningActions({ item }: SigningActionsProps) {
  const [isSigningOpen, setIsSigningOpen] = useState(false);

  const canSign = item.status === "sent" || item.status === "opened";
  const isWaiting = item.status === "awaiting";
  const hasSigned = item.completed_at !== null;

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
          {canSign && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setIsSigningOpen(true);
              }}
            >
              <FilePenLine />
              Sign
            </DropdownMenuItem>
          )}
          {isWaiting && (
            <DropdownMenuItem disabled>
              <FilePenLine />
              Waiting
            </DropdownMenuItem>
          )}
          {hasSigned && (
            <DropdownMenuItem disabled>
              <FilePenLine />
              Signed
            </DropdownMenuItem>
          )}
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
