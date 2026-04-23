"use client";

import { useAddTodo } from "@/hooks/useTodos";
import { Todo } from "@/types";
import { format } from "date-fns";
import { useState } from "react";

const todayStr = format(new Date(), "yyyy-MM-dd");

const prioritySelectStyle = {
  high: "border-red-500 text-red-400 focus:ring-red-500",
  medium: "border-yellow-500 text-yellow-400 focus:ring-yellow-500",
  low: "border-blue-400 text-blue-400 focus:ring-blue-400",
};

const dateInputClass =
  "rounded-lg border border-[var(--border)] bg-[var(--bg)] py-1.5 pl-2 pr-8 text-xs text-(--text-muted) focus:outline-none";

const CalendarIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default function AddTodoForm() {
  const addTodo = useAddTodo();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Todo["priority"]>("medium");
  const [dueDate, setDueDate] = useState(todayStr);
  const [startDate, setStartDate] = useState("");
  const [isRange, setIsRange] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!title.trim()) {
      setError("할일 내용을 입력해주세요.");
      return;
    }
    await addTodo.mutateAsync({
      title: title.trim(),
      priority,
      due_date: dueDate || null,
      start_date: isRange ? startDate || null : null,
    });
    setTitle("");
    setIsRange(false);
    setStartDate("");
    setDueDate(todayStr);
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full cursor-pointer rounded-xl border border-dashed border-[var(--border)] py-3 text-sm text-[var(--text-subtle)] transition-colors hover:border-[var(--border)] hover:text-(--text-muted)"
      >
        + 할일 추가
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-[var(--accent)] bg-[var(--surface)] p-4"
    >
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => { setTitle(e.target.value); setError(""); }}
        placeholder="할일을 입력하세요"
        className="bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        {/* 우선순위 */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Todo["priority"])}
          className={`rounded-lg border bg-(--bg) px-2 py-1.5 text-xs outline-none focus:ring-1 ${prioritySelectStyle[priority]}`}
        >
          <option value="high">높음</option>
          <option value="medium">보통</option>
          <option value="low">낮음</option>
        </select>

        {/* 기간 토글 */}
        <button
          type="button"
          onClick={() =>
            setIsRange((v) => {
              if (!v) setStartDate(todayStr);
              return !v;
            })
          }
          className={`rounded-lg border px-2 py-1.5 text-xs transition-colors ${
            isRange
              ? "border-[#e94560] text-[#e94560]"
              : "border-[var(--border)] text-[var(--text-subtle)] hover:border-[var(--text-subtle)]"
          }`}
        >
          {isRange ? "기간 ✓" : "기간 설정"}
        </button>

        {/* 날짜 입력 */}
        {isRange ? (
          <div className="flex items-center gap-1.5">
            <label className="relative cursor-pointer">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={dateInputClass}
              />
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-(--text-muted)">
                <CalendarIcon />
              </div>
            </label>
            <span className="text-xs text-[var(--text-subtle)]">~</span>
            <label className="relative cursor-pointer">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={dateInputClass}
              />
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-(--text-muted)">
                <CalendarIcon />
              </div>
            </label>
          </div>
        ) : (
          <label className="relative cursor-pointer">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={dateInputClass}
            />
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-(--text-muted)">
              <CalendarIcon />
            </div>
          </label>
        )}

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="cursor-pointer text-xs text-[var(--text-subtle)] transition-colors hover:text-[var(--text)]"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={addTodo.isPending}
            className="cursor-pointer rounded-lg bg-[#e94560] px-3 py-1.5 text-xs text-white disabled:opacity-50"
          >
            추가
          </button>
        </div>
      </div>
    </form>
  );
}
