"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useTodos, useUpdateTodoOrder } from "@/hooks/useTodos";
import { filterByView, TodoView } from "@/lib/date";
import SortableTodoItem from "@/components/todo/SortableTodoItem";
import TodoItem from "@/components/todo/TodoItem";
import AddTodoForm from "@/components/todo/AddTodoForm";
import Calendar from "@/components/todo/Calendar";
import { format, isSameDay, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

type Tab = TodoView | "all" | "calendar";

const tabs: { label: string; value: Tab }[] = [
  { label: "오늘", value: "today" },
  { label: "이번 주", value: "week" },
  { label: "이번 달", value: "month" },
  { label: "전체", value: "all" },
  { label: "달력", value: "calendar" },
];

export default function TodosPage() {
  const { data: todos, isLoading } = useTodos();
  const updateOrder = useUpdateTodoOrder();
  const [view, setView] = useState<Tab>("today");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const today = format(new Date(), "yyyy년 M월 d일 EEEE", { locale: ko });

  const filtered =
    view === "calendar"
      ? []
      : view === "all"
        ? (todos ?? [])
        : (todos?.filter((t) => filterByView(t.due_date, view, t.start_date)) ??
          []);

  const undone = filtered.filter((t) => !t.is_done);
  const done = filtered.filter((t) => t.is_done);

  const calendarTodos = selectedDate
    ? (todos?.filter(
        (t) => t.due_date && isSameDay(parseISO(t.due_date), selectedDate),
      ) ?? [])
    : [];

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = undone.findIndex((t) => t.id === active.id);
    const newIndex = undone.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(undone, oldIndex, newIndex);
    updateOrder.mutate(
      reordered.map((todo, index) => ({ id: todo.id, sort_order: index })),
    );
  }

  return (
    <div className="max-w-2xl">
      {/* 헤더 */}
      <div className="mt-4 mb-6">
        <h1 className="text-xl font-bold text-white">할일</h1>
        <p className="mt-1 text-sm text-white/30">{today}</p>
      </div>

      {/* 탭 */}
      <div className="mb-6 flex rounded-xl bg-[#16213e] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setView(tab.value)}
            className={`flex-1 cursor-pointer rounded-lg py-2 text-sm transition-colors ${
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
      ) : view === "calendar" ? (
        /* ── 달력 뷰 ── */
        <div className="flex flex-col gap-4">
          <Calendar
            todos={todos ?? []}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          {selectedDate && (
            <div>
              <p className="mb-2 text-xs text-white/40">
                {format(selectedDate, "M월 d일", { locale: ko })} 할일{" "}
                {calendarTodos.length}개
              </p>
              {calendarTodos.length === 0 ? (
                <p className="py-6 text-center text-sm text-white/20">
                  할일이 없어요
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {calendarTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ── 목록 뷰 ── */
        <div className="flex flex-col gap-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={undone.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {undone.map((todo) => (
                <SortableTodoItem key={todo.id} todo={todo} />
              ))}
            </SortableContext>
          </DndContext>

          <AddTodoForm />

          {done.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs text-white/20">완료 {done.length}개</p>
              <div className="flex flex-col gap-2">
                {done.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            </div>
          )}

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
