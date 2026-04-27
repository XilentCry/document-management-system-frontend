"use client";

import {
  Avatar,
  AvatarFallback
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutButton } from "./logout-button"
import { useCurrentUser } from "@/features/auth/api/me-queries"
import { getInitials } from "@/lib/get-initials"
import { Skeleton } from "@/components/ui/skeleton"

export function AvatarDropdown() {
  const { data: currentUser, isLoading } = useCurrentUser();
  const firstName = currentUser?.firstName ?? "";
  const middleName = currentUser?.middleName ?? "";
  const lastName = currentUser?.lastName ?? "";
  const email = currentUser?.email ?? "";

  const initials = getInitials(firstName || "", lastName || "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full" />}>
        {isLoading ? (
          <Skeleton className="size-8 rounded-full" />
        ) : (
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm">
                <Skeleton className="size-8 rounded-full" />
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <Skeleton className="h-4 mb-1" />
                  <Skeleton className="h-3" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <p className="truncate font-medium">{firstName} {middleName ?? ""} {lastName}</p>
                  <p className="truncate text-muted-foreground text-xs">{email}</p>
                </div>
              </div>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <LogoutButton />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}
