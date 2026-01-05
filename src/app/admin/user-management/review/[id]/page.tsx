"use client";

import { ReviewUser } from "@/components/admin/user-management/review-user";
import { LogoutButton } from "@/components/logout-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Spinner } from "@/components/ui/spinner";
import { useGetUser } from "@/services/users/queries";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ReviewUserPage() {
  const { id } = useParams<{ id: string }>();

  const { isLoading, isError, error, data: user } = useGetUser(id);

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-background sticky top-0 h-14 border-b flex items-center justify-between px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/admin/user-management" />}>
                User Management
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Review User</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <LogoutButton />
      </header>
      <div className="p-4 flex-1 flex flex-col gap-4">
        <h1 className="text-2xl">Review User</h1>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner className="text-primary size-9" />
          </div>
        ) : isError && error ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-destructive text-sm">{error.message}</p>
          </div>
        ) : (
          user && <ReviewUser user={user} />
        )}
      </div>
    </div>
  );
}
