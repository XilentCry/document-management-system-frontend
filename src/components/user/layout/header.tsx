import { ModeToggle } from "@/components/shared/mode-toggle";
import { LogoutButton } from "@/components/shared/logout-button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="z-10 bg-background sticky top-0 h-14 border-b flex items-center justify-between px-4">
      <ButtonGroup>
        <Input placeholder="Search..." className="w-2xl" />
      </ButtonGroup>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <LogoutButton />
      </div>
    </header>
  );
}
