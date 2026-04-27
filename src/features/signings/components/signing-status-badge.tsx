import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getSubmissionStatusBadgeClass } from "@/lib/get-status-badge-class";

interface SigningStatusBadgeProps {
  status: string;
  className?: string;
}

export function SigningStatusBadge({ status, className }: SigningStatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  return (
    <Badge
      variant="secondary"
      className={cn("capitalize font-semibold", getSubmissionStatusBadgeClass(status), className)}
    >
      {normalizedStatus}
    </Badge>
  );
}
