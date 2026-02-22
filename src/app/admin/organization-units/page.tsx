import { OrganizationUnitList } from "@/components/admin/organization-units/organization-unit-list";
import { LogoutButton } from "@/components/shared/logout-button";
import { ModeToggle } from "@/components/shared/mode-toggle";

export default function OrganizationUnitsPage() {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="z-10 bg-background sticky top-0 h-14 border-b flex items-center justify-end px-4">
        <div className="flex items-center gap-2">
          <ModeToggle />
          <LogoutButton />
        </div>
      </header>
      <div className="p-4 flex-1 flex flex-col gap-4">
        <h1 className="text-xl">Organization Units</h1>
        <OrganizationUnitList />
      </div>
    </div>
  );
}
