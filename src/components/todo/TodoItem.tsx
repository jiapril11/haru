"use client";

import { useState } from "react";
import { Todo } from "@/types";
import { useToggleTodo, useDeleteTodo, useUpdateTodo } from "@/hooks/useTodos";
import DailyCheckGrid from "./DailyCheckGrid";

const priorityBorder = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500",
  low: "border-l-blue-400",
};

const prioritySelectStyle = {
  high: "border-red-500 text-red-400 focus:ring-red-500",
  medium: "border-yellow-500 text-yellow-400 focus:ring-yellow-500",
  low: "border-blue-400 text-blue-400 focus:ring-blue-400",
};

type Props = {
  todo: Todo;
  showDate?: boolean;
};

export default function TodoItem({ todo, showDate = false }: Props) {
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();
  const updateTodo = useUpdateTodo();

  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState("");
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editDueDate, setEditDueDate] = useState(todo.due_date ?? "");
  const [editStartDate, setEditStartDate] = useState(todo.start_date ?? "");

  const isRange = !!todo.start_date && !!todo.due_date;

  function handleSave() {
    if (!editTitle.trim()) {
      setEditError("할일 내용을 입력해주세요.");
      return;
    }
    setEditError("");
    updateTodo.mutate(
      {
        id: todo.id,
        title: editTitle.trim(),
        priority: editPriority,
        ...(isRange
          ? { start_date: editStartDate || null, due_date: editDueDate || null }
          : { due_date: editDueDate || null }),
      },
      { onSuccess: () => setIsEditing(false) },
    );
  }

  function handleCancel() {
    setEditTitle(todo.title);
    setEditPriority(todo.priority);
    setEditDueDate(todo.due_date ?? "");
    setEditStartDate(todo.start_date ?? "");
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="rounded-xl border border-[var(--accent)] bg-[var(--surface)] px-4 py-3">
        <div className="flex flex-col gap-2">
          <input
            autoFocus
            value={editTitle}
            onChange={(e) => { setEditTitle(e.target.value); setEditError(""); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            className="w-full rounded-lg bg-[var(--surface2)] px-3 py-1.5 text-sm text-[var(--text)] outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
          {editError && <p className="text-xs text-red-400">{editError}</p>}
          <div className="flex items-center gap-2">
            <select
              value={editPriority}
              onChange={(e) =>
                setEditPriority(e.target.value as Todo["priority"])
              }
              className={`rounded-lg border bg-(--surface2) px-2 py-1 text-xs outline-none focus:ring-1 ${prioritySelectStyle[editPriority]}`}
            >
              <option value="high">높음</option>
              <option value="medium">보통</option>
              <option value="low">낮음</option>
            </select>
            {isRange ? (
              <>
                <input
                  type="date"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  className="rounded-lg bg-[var(--surface2)] px-2 py-1 text-xs text-[var(--text)] outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
                <span className="text-xs text-[var(--text-faint)]">~</span>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="rounded-lg bg-[var(--surface2)] px-2 py-1 text-xs text-[var(--text)] outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </>
            ) : (
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="rounded-lg bg-[var(--surface2)] px-2 py-1 text-xs text-[var(--text)] outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            )}
            <div className="ml-auto flex gap-2">
              <button
                onClick={handleCancel}
                className="cursor-pointer text-xs text-[var(--text-subtle)] hover:text-[var(--text)]"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={updateTodo.isPending}
                className="cursor-pointer text-xs text-[var(--accent)] hover:opacity-80 disabled:opacity-50"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group rounded-xl border border-(--border) border-l-4 bg-(--surface) px-4 py-3 ${priorityBorder[todo.priority]}`}>
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
            {todo.is_done && (
              <span className="text-xs text-white">✓</span>
            )}
          </button>
        )}

        {/* 제목 */}
        <span
          className={`flex-1 text-sm ${
            todo.is_done
              ? "text-[var(--text-subtle)] line-through"
              : "text-[var(--text)]"
          }`}
        >
          {todo.title}
        </span>

        {/* 단일 날짜 표시 */}
        {!isRange && showDate && (
          <span className="text-xs text-[var(--text-subtle)]">
            {todo.due_date?.slice(5).replace("-", "/")}
          </span>
        )}

        {/* 수정 */}
        <button
          onClick={() => setIsEditing(true)}
          className="cursor-pointer text-xs text-[var(--text-faint)] transition-colors hover:text-[var(--text)]"
        >
          수정
        </button>

        {/* 삭제 */}
        <button
          onClick={() => deleteTodo.mutate(todo.id)}
          className="cursor-pointer text-xs text-[var(--text-faint)] transition-colors hover:text-[#e94560]"
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
          isDone={todo.is_done}
        />
      )}
    </div>
  );
}
