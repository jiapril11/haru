"use client";

import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isThisWeek,
  isSameDay,
  parseISO,
  addMonths,
  subMonths,
} from "date-fns";
import { ko } from "date-fns/locale";
import { Todo } from "@/types";

type Props = {
  todos: Todo[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
};

export default function Calendar({ todos, selectedDate, onSelectDate }: Props) {
  const [baseDate, setBaseDate] = useState(new Date());

  const start = startOfWeek(startOfMonth(baseDate), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(baseDate), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

  function hasTodo(date: Date) {
    return todos.some(
      (t) => t.due_date && isSameDay(parseISO(t.due_date), date),
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#16213e] p-4">
      {/* 월 이동 */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setBaseDate(subMonths(baseDate, 1))}
          className="px-2 text-white/40 transition-colors hover:text-white"
        >
          ←
        </button>
        <h2 className="font-bold text-white">
          {format(baseDate, "yyyy년 M월", { locale: ko })}
        </h2>
        <button
          onClick={() => setBaseDate(addMonths(baseDate, 1))}
          className="px-2 text-white/40 transition-colors hover:text-white"
        >
          →
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="mb-2 grid grid-cols-7">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-1 text-center text-xs text-white/30">
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, baseDate);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isThisWeekDay = isThisWeek(day, { weekStartsOn: 0 });

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`relative flex flex-col items-center justify-center rounded-lg py-1.5 transition-colors ${
                isSelected
                  ? "bg-[#e94560]"
                  : isToday(day)
                    ? "bg-[#0f3460]"
                    : isThisWeekDay && isCurrentMonth
                      ? "bg-white/5"
                      : ""
              } ${!isCurrentMonth ? "opacity-25" : "hover:bg-white/10"}`}
            >
              <span
                className={`text-xs ${
                  isSelected || isToday(day)
                    ? "font-bold text-white"
                    : "text-white/60"
                }`}
              >
                {format(day, "d")}
              </span>
              {hasTodo(day) && (
                <span
                  className={`mt-0.5 h-1 w-1 rounded-full ${
                    isSelected ? "bg-white" : "bg-[#e94560]"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
