"use client";

import { Button } from "@/components/ui/button";
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
import { useUploadStore } from "@/stores/upload-store";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
} from "lucide-react";
import { useState } from "react";

export function UploadProgress() {
  const [isMinimized, setIsMinimized] = useState(false);
  const uploadingFiles = useUploadStore((state) => state.uploadingFiles);
  const cancelAll = useUploadStore((state) => state.cancelAll);
  const clearCompleted = useUploadStore((state) => state.clearCompleted);

  if (uploadingFiles.length === 0) return null;

  const uploadingCount = uploadingFiles.filter(
    (file) => file.status === "uploading",
  ).length;
  const completedCount = uploadingFiles.filter(
    (file) => file.status === "complete",
  ).length;
  const cancelledCount = uploadingFiles.filter(
    (file) => file.status === "cancelled",
  ).length;
  const failedCount = uploadingFiles.filter(
    (file) => file.status === "failed",
  ).length;

  const title = () => {
    if (uploadingCount > 0) {
      return `Uploading ${uploadingCount} items`;
    }
    if (completedCount > 0 && failedCount === 0 && cancelledCount === 0) {
      return `${completedCount} upload${
        completedCount > 1 ? "s" : ""
      } complete`;
    }
    if (failedCount > 0) {
      return `${failedCount} upload${failedCount > 1 ? "s" : ""} failed`;
    }
    if (cancelledCount > 0) {
      return `${cancelledCount} upload${
        cancelledCount > 1 ? "s" : ""
      } cancelled`;
    }
    return "Uploads";
  };

  return (
    <Card className="fixed bottom-4 left-4 w-96" size="sm">
      <CardHeader>
        <CardTitle>{title()}</CardTitle>
        <CardAction>
          {uploadingCount > 0 && (
            <Button variant="ghost" onClick={cancelAll}>
              Cancel
            </Button>
          )}
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
          <ScrollArea className="h-40">
            {uploadingFiles.map((file) => (
              <Item key={file.id}>
                <ItemMedia variant="icon">
                  <FileText />
                </ItemMedia>
                <ItemContent className="min-w-0">
                  <ItemTitle className="block w-auto truncate">
                    {file.file.name}
                  </ItemTitle>
                  <ItemDescription className="text-xs">
                    {file.status === "cancelled" && (
                      <span>Upload cancelled</span>
                    )}
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
