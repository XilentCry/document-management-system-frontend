import { MonitorSmartphone } from "lucide-react";
import { EmptyState } from "./empty-state";

export function MobileBlocker() {
  return (
    <div className="h-svh flex md:hidden">
      <EmptyState icon={MonitorSmartphone} title="Desktop & Tablet Only" description="This application is optimized for larger screens. Please open it on a tablet or desktop device for the best experience." />
    </div>
  );
}
