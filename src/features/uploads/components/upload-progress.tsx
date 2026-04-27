"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { useUploadStore } from "@/features/uploads/store/upload-store";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { useState } from "react";

export function UploadProgress() {
  const [isMinimized, setIsMinimized] = useState(false);
  const uploadingFiles = useUploadStore((state) => state.uploadingFiles);
  const clearCompleted = useUploadStore((state) => state.clearCompleted);

  if (uploadingFiles.length === 0) return null;

  const counts = uploadingFiles.reduce(
    (acc, file) => {
      switch (file.status) {
        case "uploading":
          acc.uploadingCount += 1;
          break;
        case "complete":
          acc.completedCount += 1;
          break;
        case "failed":
          acc.failedCount += 1;
          break;
      }
      return acc;
    },
    { uploadingCount: 0, completedCount: 0, failedCount: 0 },
  );

  const { uploadingCount, completedCount, failedCount } = counts;

  const title = () => {
    if (uploadingCount > 0) {
      return `Uploading ${uploadingCount} items`;
    }
    if (completedCount > 0 && failedCount === 0) {
      return `${completedCount} upload${completedCount > 1 ? "s" : ""
        } complete`;
    }
    if (failedCount > 0) {
      return `${failedCount} upload${failedCount > 1 ? "s" : ""} failed`;
    }
    return "Uploads";
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96" size="sm">
      <CardHeader>
        <CardTitle>{title()}</CardTitle>
        <CardAction>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <ChevronUp /> : <ChevronDown />}
          </Button>
          {uploadingCount === 0 && (
            <Button variant="ghost" size="icon" onClick={clearCompleted}>
              <X />
            </Button>
          )}
        </CardAction>
      </CardHeader>
      {!isMinimized && (
        <CardContent>
          <ScrollArea className="max-h-40 min-h-0">
            {[...uploadingFiles].reverse().map((file) => (
              <Item key={file.id} size="xs" className="px-0">
                <ItemMedia>
                  <Image src="/pdf.svg" alt="PDF" width={16} height={16} />
                </ItemMedia>
                <ItemContent className="min-w-0">
                  <ItemTitle className="block w-auto truncate">
                    {file.file.name}
                  </ItemTitle>
                  <ItemDescription className="text-xs">
                    {file.status === "failed" && (
                      <span className="text-destructive">{file.error}</span>
                    )}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  {file.status === "uploading" && (
                    <Spinner className="text-primary" />
                  )}
                  {file.status === "complete" && (
                    <CheckCircle2 className="size-4 text-green-500" />
                  )}
                  {file.status === "failed" && (
                    <AlertCircle className="size-4 text-destructive" />
                  )}
                </ItemActions>
              </Item>
            ))}
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
