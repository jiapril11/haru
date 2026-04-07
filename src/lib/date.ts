import { isThisMonth, isThisWeek, isToday, parseISO } from "date-fns";

export type TodoView = "today" | "week" | "month";

export function filterByView(dueDate: string | null, view: TodoView): boolean {
  if (!dueDate) return false;
  const date = parseISO(dueDate);
  if (view === "today") return isToday(date);
  if (view === "week") return isThisWeek(date, { weekStartsOn: 1 });
  if (view === "month") return isThisMonth(date);
  return false;
}
