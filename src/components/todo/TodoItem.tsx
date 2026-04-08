"use client";

import { Todo } from "@/types";
import { useToggleTodo, useDeleteTodo } from "@/hooks/useTodos";
import DailyCheckGrid from "./DailyCheckGrid";

const priorityStyle = {
  high: "bg-red-500/20 text-red-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  low: "bg-blue-500/20 text-blue-400",
};

const priorityLabel = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

type Props = {
  todo: Todo;
};

export default function TodoItem({ todo }: Props) {
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  const isRange = !!todo.start_date && !!todo.due_date;

  return (
    <div className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <div className="flex items-center gap-3">
        {/* 체크박스 — 기간 투두는 숨김 */}
        {!isRange && (
          <button
            onClick={() =>
              toggleTodo.mutate({ id: todo.id, is_done: !todo.is_done })
            }
            className={`flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-colors ${
              todo.is_done
                ? "border-emerald-500 bg-emerald-500"
                : "border-[var(--border)] hover:border-emerald-500"
            }`}
          >
            {todo.is_done && <span className="text-xs text-[var(--text)]">✓</span>}
          </button>
        )}

        {/* 제목 */}
        <span
          className={`flex-1 text-sm ${
            !isRange && todo.is_done
              ? "text-[var(--text-subtle)] line-through"
              : "text-[var(--text)]"
          }`}
        >
          {todo.title}
        </span>

        {/* 기간 표시 */}
        {isRange && (
          <span className="text-xs text-[var(--text-subtle)]">
            {todo.start_date?.slice(5).replace("-", "/")} ~{" "}
            {todo.due_date?.slice(5).replace("-", "/")}
          </span>
        )}

        {/* 우선순위 */}
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            priorityStyle[todo.priority]
          }`}
        >
          {priorityLabel[todo.priority]}
        </span>

        {/* 삭제 */}
        <button
          onClick={() => deleteTodo.mutate(todo.id)}
          className="cursor-pointer text-xs text-[var(--text-faint)] transition-colors md:opacity-0 md:group-hover:opacity-100 hover:text-[#e94560]"
        >
          삭제
        </button>
      </div>

      {/* 날짜 그리드 */}
      {isRange && (
        <DailyCheckGrid
          todoId={todo.id}
          startDate={todo.start_date!}
          endDate={todo.due_date!}
        />
      )}
    </div>
  );
}
