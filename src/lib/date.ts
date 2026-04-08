import {
  eachDayOfInterval,
  isThisMonth,
  isThisWeek,
  isToday,
  parseISO,
} from "date-fns";

export type TodoView = "today" | "week" | "month";

export function filterByView(
  dueDate: string | null,
  view: TodoView,
  startDate?: string | null,
): boolean {
  if (!dueDate) return false;
  if (startDate) {
    const days = eachDayOfInterval({
      start: parseISO(startDate),
      end: parseISO(dueDate),
    });
    if (view === "today") return days.some((d) => isToday(d));
    if (view === "week")
      return days.some((d) => isThisWeek(d, { weekStartsOn: 1 }));
    if (view === "month") return days.some((d) => isThisMonth(d));
    return false;
  }
  const date = parseISO(dueDate);
  if (view === "today") return isToday(date);
  if (view === "week") return isThisWeek(date, { weekStartsOn: 1 });
  if (view === "month") return isThisMonth(date);
  return false;
}
