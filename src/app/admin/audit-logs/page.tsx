import { AuditLogList } from "@/components/admin/audit-logs/audit-log-list";
import { AvatarDropdown } from "@/components/shared/avatar-dropdown";
import { ModeToggle } from "@/components/shared/mode-toggle";

export default function AuditLogsPage() {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="z-10 bg-background sticky top-0 h-14 border-b flex items-center justify-end px-4">
        <div className="flex items-center gap-2">
          <ModeToggle />
          <AvatarDropdown />
        </div>
      </header>
      <div className="p-4 flex-1 flex flex-col gap-4">
        <h1 className="text-xl">Audit Logs</h1>
        <AuditLogList />
      </div>
    </div>
  );
}
