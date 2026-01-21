import { LogoutButton } from "@/components/shared/logout-button";
// import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
// import { Filter } from "lucide-react";

export function Header() {
  return (
    <header className="z-10 bg-background sticky top-0 h-14 border-b flex items-center justify-between px-4">
      <ButtonGroup>
        <Input placeholder="Search..." className="w-2xl" />
        {/* <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" aria-label="Search" />}
          >
            <Filter />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Private</DropdownMenuItem>
              <DropdownMenuItem>Protected</DropdownMenuItem>
              <DropdownMenuItem>Public</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </ButtonGroup>
      <LogoutButton />
    </header>
  );
}
