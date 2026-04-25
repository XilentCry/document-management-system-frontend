export function getUserStatusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-amber-500/15 dark:bg-amber-500/10 text-amber-500";
    case "active":
      return "bg-green-500/15 dark:bg-green-500/10 text-green-500";
    case "inactive":
      return "bg-neutral-500/15 dark:bg-neutral-500/10 text-neutral-500";
    case "suspended":
      return "bg-red-500/15 dark:bg-red-500/10 text-red-500";
    default:
      return "";
  }
}

export function getSubmissionStatusBadgeClass(status: string) {
  const s = status.toLowerCase();
  switch (s) {
    case "pending":
    case "awaiting":
    case "sent":
    case "opened":
      return "bg-amber-500/15 dark:bg-amber-500/10 text-amber-500";
    case "completed":
      return "bg-green-500/15 dark:bg-green-500/10 text-green-500";
    case "declined":
      return "bg-red-500/15 dark:bg-red-500/10 text-red-500";
    case "expired":
      return "bg-neutral-500/15 dark:bg-neutral-500/10 text-neutral-500";
    default:
      return "";
  }
}
