"use client";

import { UserDetails } from "@/features/users/components/user-details";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { AvatarDropdown } from "@/components/shared/avatar-dropdown";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Spinner } from "@/components/ui/spinner";
import { useGetUser } from "@/features/users/api/queries";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ViewUserPage() {
  const { id } = useParams<{ id: string }>();

  const { isLoading, isError, error, data: user } = useGetUser(id);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="z-10 bg-background sticky top-0 h-14 border-b flex items-center justify-between px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/admin/user-management" />}>
                User Management
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>User Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <AvatarDropdown />
        </div>
      </header>
      <div className="p-4 flex-1 flex flex-col gap-4">
        <h1 className="text-xl">User Details</h1>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner className="text-primary size-9" />
          </div>
        ) : isError && error ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-destructive text-sm">{error.message}</p>
          </div>
        ) : (
          user && <UserDetails user={user} />
        )}
      </div>
    </div>
  );
}
