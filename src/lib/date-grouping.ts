export function getRelativeDateGroup(dateInput: string | Date | undefined) {
  if (!dateInput) return "Older";

  // Attempt to parse the date input
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Older";

  // Create a pure date without time for precise day comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compareDate = new Date(d);
  compareDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - compareDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Today"; // Just in case of future dates
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "Last 7 days";
  if (diffDays <= 30) return "Last 30 days";
  if (today.getFullYear() === d.getFullYear()) return "Earlier this year";

  return "Older";
}

export function groupItemsByRelativeDate<T>(
  items: T[],
  dateExtractor: (item: T) => string | Date | undefined
) {
  // Use a predictable order of groups
  const groupOrder = [
    "Today",
    "Yesterday",
    "Last 7 days",
    "Last 30 days",
    "Earlier this year",
    "Older",
  ];

  const groups: Record<string, T[]> = {};

  items.forEach((item) => {
    const group = getRelativeDateGroup(dateExtractor(item));
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
  });

  // Return as an array of objects to preserve iteration order
  return groupOrder
    .map((group) => ({ group, items: groups[group] || [] }))
    .filter((g) => g.items.length > 0);
}
