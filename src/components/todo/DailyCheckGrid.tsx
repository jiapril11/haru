"use client";

import { useDailyChecks, useToggleDailyCheck, useToggleTodo } from "@/hooks/useTodos";
import {
  eachDayOfInterval,
  format,
  formatDate,
  isFuture,
  parseISO,
} from "date-fns";
import { ko } from "date-fns/locale";

type Props = {
  todoId: string;
  startDate: string;
  endDate: string;
  isDone: boolean;
};

export default function DailyCheckGrid({ todoId, startDate, endDate, isDone }: Props) {
  const { data: checks = [] } = useDailyChecks(todoId);
  const toggleCheck = useToggleDailyCheck();
  const toggleTodo = useToggleTodo();

  const days = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate),
  });

  const checkedDates = new Set(checks.map((c) => c.date));
  const completedCount = checkedDates.size;

  function handleToggle(date: string) {
    const wasChecked = checkedDates.has(date);
    toggleCheck.mutate(
      { todoId, date, checked: wasChecked },
      {
        onSuccess: () => {
          const newCount = wasChecked ? completedCount - 1 : completedCount + 1;
          const allDone = newCount === days.length;
          if (allDone !== isDone) {
            toggleTodo.mutate({ id: todoId, is_done: allDone });
          }
        },
      },
    );
  }

  return (
    <div className="mt-4">
      {/* 버튼 그리드 + 기간 날짜 */}
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {days.map((day) => {
            const dateStr = formatDate(day, "yyyy-MM-dd");
            const isChecked = checkedDates.has(dateStr);
            const isFutureDay = isFuture(day);

            return (
              <button
                key={dateStr}
                onClick={() => !isFutureDay && handleToggle(dateStr)}
                disabled={isFutureDay}
                title={format(day, "M월 d일 (EEE)", { locale: ko })}
                className={`h-5 w-5 rounded-md text-xs font-medium transition-colors ${
                  isChecked
                    ? "bg-emerald-500 text-[var(--text)]"
                    : isFutureDay
                      ? "cursor-not-allowed bg-[var(--border)] text-[var(--text-faint)]"
                      : "cursor-pointer bg-[var(--border)] text-[var(--text-subtle)] hover:bg-[var(--text-faint)]"
                }`}
              ></button>
            );
          })}
        </div>
        <span className="text-xs text-[var(--text-faint)]">
          {startDate.slice(5).replace("-", "/")} ~{" "}
          {endDate.slice(5).replace("-", "/")}
        </span>
      </div>

      {/* 진행률 */}
      <div className="flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${(completedCount / days.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-[var(--text-subtle)]">
          {Math.round((completedCount / days.length) * 100)}%
        </span>
      </div>
    </div>
  );
}
