"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { InfiniteScrollContainer } from "@/components/shared/infinite-scroll-container";
import { SubmissionList } from "@/features/submissions/components/submission-list";
import { SubmissionGrid } from "@/features/submissions/components/submission-grid";
import { SubmittersRail } from "@/features/submissions/components/submitters-rail";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useViewModeStore } from "@/stores/view-mode-store";
import { useGetMySubmissions } from "@/features/auth/api/me-queries";
import { LayoutGrid, List, Send } from "lucide-react";
import { useState } from "react";

export default function MySubmissionsPage() {
  const viewMode = useViewModeStore((state) => state.viewMode);
  const setViewMode = useViewModeStore((state) => state.setViewMode);

  const [status, setStatus] = useState("all");

  const handleStatusChange = (value: string) => setStatus(value);

  const {
    isLoading,
    isError,
    isFetchNextPageError,
    error,
    isSuccess,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMySubmissions(status === "all" ? undefined : status);

  const submissions = data?.pages.flatMap((page) => page.data || []) ?? [];

  if (isError && error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-destructive text-sm">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner className="text-primary size-9" />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col p-4 pt-0 min-w-0">
        <div className="flex items-center justify-between sticky top-14 bg-background z-10 py-4">
          <Breadcrumb>
            <BreadcrumbList className="text-xl">
              <BreadcrumbItem>
                <BreadcrumbPage>My Submissions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <ToggleGroup
            variant="outline"
            value={[viewMode]}
            onValueChange={(value) => {
              if (!value[0]) return;

              setViewMode(value[0] as "grid" | "list");
            }}
          >
            <ToggleGroupItem value="list">
              <List />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid">
              <LayoutGrid />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <Tabs value={status} onValueChange={handleStatusChange}>
            <TabsList variant="line">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="declined">Declined</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
          </Tabs>

          {isSuccess && submissions.length === 0 ? (
            <EmptyState
              icon={Send}
              title="No submissions found"
              description="Submissions you send out for signing will appear here."
            />
          ) : (
            <InfiniteScrollContainer
              onBottomReached={() =>
                hasNextPage && !isFetchingNextPage && fetchNextPage()
              }
            >
              {viewMode === "list" ? (
                <SubmissionList data={submissions} />
              ) : (
                <SubmissionGrid data={submissions} />
              )}
              {isFetchingNextPage && (
                <div className="py-4 flex items-center justify-center">
                  <Spinner className="text-primary size-9" />
                </div>
              )}
            </InfiniteScrollContainer>
          )}

          {isFetchNextPageError && error && (
            <div className="py-4 flex-1 flex flex-col items-center justify-center gap-4">
              <p className="text-destructive text-sm">{error.message}</p>
              <Button
                variant="outline"
                onClick={() =>
                  hasNextPage && !isFetchingNextPage && fetchNextPage()
                }
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
      <SubmittersRail />
    </>
  );
}
