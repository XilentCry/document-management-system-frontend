"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocusealForm } from "@docuseal/react";
import { X } from "lucide-react";
import { toast } from "sonner";

interface SigningFormViewerProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  documentName: string;
}

export function SigningFormViewer({
  isOpen,
  onClose,
  token,
}: SigningFormViewerProps) {
  if (!isOpen) return null;

  return (
    <div className="bg-background fixed inset-0 isolate z-50 flex flex-col">
      <header className="bg-background border-b h-14 flex items-center justify-between px-4 text-foreground">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
          <span className="text-sm leading-none font-medium">
            Sign Document
          </span>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <DocusealForm
            src={`${process.env.NEXT_PUBLIC_DOCUSEAL_SIGN_URL}${token}`}
            logo={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/norsu.png`}
            withDownloadButton={false}
            withSendCopyButton={false}
            sendCopyEmail={false}
            onComplete={() => {
              toast.success("Document successfully signed.");
              onClose();
            }}
          />
        </ScrollArea>
      </div>
    </div>
  );
}
