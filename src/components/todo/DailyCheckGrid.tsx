"use client";

import { useDailyChecks, useToggleDailyCheck } from "@/hooks/useTodos";
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
};

export default function DailyCheckGrid({ todoId, startDate, endDate }: Props) {
  const { data: checks = [] } = useDailyChecks(todoId);
  const toggleCheck = useToggleDailyCheck();

  const days = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate),
  });

  const checkedDates = new Set(checks.map((c) => c.date));
  const completedCount = checkedDates.size;

  function handleToggle(date: string) {
    toggleCheck.mutate({
      todoId,
      date,
      checked: checkedDates.has(date),
    });
  }
  return (
    <div className="mt-2 pl-8">
      {/* 날짜 그리드 */}
      <div className="mb-2 flex flex-wrap gap-1.5">
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
                  ? "bg-emerald-500 text-white"
                  : isFutureDay
                    ? "cursor-not-allowed bg-white/10 text-white/15"
                    : "cursor-pointer bg-white/10 text-white/40 hover:bg-white/20"
              }`}
            ></button>
          );
        })}
      </div>
      {/* 진행률 */}
      <div className="flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${(completedCount / days.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-white/30">
          {completedCount}/{days.length}일
        </span>
      </div>
    </div>
  );
}
