"use client";

import { useTodos } from "@/hooks/useTodos";
import { filterByView, TodoView } from "@/lib/date";
import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import TodoItem from "@/components/todo/TodoItem";
import AddTodoForm from "@/components/todo/AddTodoForm";

const tabs: { label: string; value: TodoView }[] = [
  { label: "오늘", value: "today" },
  { label: "이번 주", value: "week" },
  { label: "이번 달", value: "month" },
];
export default function TodosPage() {
  const { data: todos, isLoading } = useTodos();
  const [view, setView] = useState<TodoView>("today");

  const filtered = todos?.filter((t) => filterByView(t.due_date, view)) ?? [];
  const done = filtered.filter((t) => t.is_done);
  const undone = filtered.filter((t) => !t.is_done);

  const today = format(new Date(), "yyyy년 M월 d일 EEEE", { locale: ko });
  return (
    <div className="max-w-2xl">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">투두</h1>
        <p className="mt-1 text-sm text-white/30">{today}</p>
      </div>

      {/* 탭 */}
      <div className="mb-6 flex rounded-xl bg-[#16213e] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setView(tab.value)}
            className={`flex-1 rounded-lg py-2 text-sm transition-colors ${
              view === tab.value
                ? "bg-[#0f3460] font-medium text-white"
                : "text-white/40 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="py-12 text-center text-sm text-white/30">
          불러오는 중...
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {/* 미완료 */}
          {undone.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}

          {/* 추가 폼 */}
          <AddTodoForm />

          {done.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs text-white/20">완료 {done.length}개</p>
              {done.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}

          {/* 빈 상태 */}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="mb-3 text-3xl">✅</p>
              <p className="text-sm text-white/30">할일이 없어요!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
