"use client";

import { useState, useRef } from "react";
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
import { Todo } from "@/types";
import type { SensorDescriptor, SensorOptions } from "@dnd-kit/core";

type MobileTab = TodoView | "all" | "calendar";
type RightTab = "week" | "month" | "all" | "calendar";

const mobileTabs: { label: string; value: MobileTab }[] = [
  { label: "오늘", value: "today" },
  { label: "이번 주", value: "week" },
  { label: "이번 달", value: "month" },
  { label: "전체", value: "all" },
  { label: "달력", value: "calendar" },
];

const rightTabs: { label: string; value: RightTab }[] = [
  { label: "이번 주", value: "week" },
  { label: "이번 달", value: "month" },
  { label: "전체", value: "all" },
  { label: "달력", value: "calendar" },
];

function sortDoneByDate(list: Todo[]) {
  return [...list].sort((a, b) => {
    const aDate = a.due_date ?? "";
    const bDate = b.due_date ?? "";
    return bDate.localeCompare(aDate);
  });
}

function sortByDate(list: Todo[]) {
  return [...list].sort((a, b) => {
    const aDate = a.start_date ?? a.due_date ?? "";
    const bDate = b.start_date ?? b.due_date ?? "";
    if (aDate !== bDate) return aDate.localeCompare(bDate);
    return a.sort_order - b.sort_order;
  });
}

type TodoListProps = {
  undone: Todo[];
  done: Todo[];
  filtered: Todo[];
  showAddForm?: boolean;
  showDate?: boolean;
  showOverdue?: boolean;
  defaultDoneOpen?: boolean;
  sensors: SensorDescriptor<SensorOptions>[];
  onDragEnd: (event: DragEndEvent) => void;
};

function TodoList({
  undone,
  done,
  filtered,
  showAddForm = false,
  showDate = false,
  showOverdue = false,
  defaultDoneOpen = false,
  sensors,
  onDragEnd,
}: TodoListProps) {
  const [doneOpen, setDoneOpen] = useState(defaultDoneOpen);
  const [overdueOpen, setOverdueOpen] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");
  const overdue = showOverdue
    ? sortDoneByDate(
        undone.filter((t) => {
          const date = t.due_date ?? t.start_date;
          return date && date < today;
        }),
      )
    : [];
  const activeUndone = showOverdue
    ? undone.filter((t) => {
        const date = t.due_date ?? t.start_date;
        return !date || date >= today;
      })
    : undone;

  return (
    <div className="flex flex-col gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={activeUndone.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {activeUndone.map((todo) => (
            <SortableTodoItem key={todo.id} todo={todo} showDate={showDate} />
          ))}
        </SortableContext>
      </DndContext>

      {showAddForm && <AddTodoForm />}

      {done.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setDoneOpen((v) => !v)}
            className="mb-2 flex cursor-pointer items-center gap-1 text-xs text-(--text-faint) hover:text-(--text-subtle)"
          >
            <span>{doneOpen ? "▾" : "▸"}</span>
            <span>완료 {done.length}개</span>
          </button>
          {doneOpen && (
            <div className="flex flex-col gap-2">
              {done.map((todo) => (
                <TodoItem key={todo.id} todo={todo} showDate={showDate} />
              ))}
            </div>
          )}
        </div>
      )}

      {overdue.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setOverdueOpen((v) => !v)}
            className="mb-2 flex cursor-pointer items-center gap-1 text-xs text-(--text-faint) hover:text-(--text-subtle)"
          >
            <span>{overdueOpen ? "▾" : "▸"}</span>
            <span>미완료 {overdue.length}개</span>
          </button>
          {overdueOpen && (
            <div className="flex flex-col gap-2">
              {overdue.map((todo) => (
                <TodoItem key={todo.id} todo={todo} showDate={showDate} />
              ))}
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="mb-3 text-3xl">✅</p>
          <p className="text-sm text-(--text-subtle)">할일이 없어요!</p>
        </div>
      )}
    </div>
  );
}

type CalendarViewProps = {
  todos: Todo[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  calendarTodos: Todo[];
};

function CalendarView({ todos, selectedDate, onSelectDate, calendarTodos }: CalendarViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <Calendar
        todos={todos}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />
      {selectedDate && (
        <div>
          <p className="mb-2 text-xs text-(--text-subtle)">
            {format(selectedDate, "M월 d일", { locale: ko })} 할일{" "}
            {calendarTodos.length}개
          </p>
          {calendarTodos.length === 0 ? (
            <p className="py-6 text-center text-sm text-(--text-faint)">
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
  );
}

export default function TodosPage() {
  const { data: todos, isLoading } = useTodos();
  const updateOrder = useUpdateTodoOrder();

  const [mobileView, setMobileView] = useState<MobileTab>("today");
  const [rightView, setRightView] = useState<RightTab>("week");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [leftWidth, setLeftWidth] = useState(50);

  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(useSensor(PointerSensor));
  const todayLabel = format(new Date(), "yyyy년 M월 d일 EEEE", { locale: ko });

  // 오늘 데이터
  const todayTodos =
    todos?.filter((t) => filterByView(t.due_date, "today", t.start_date)) ?? [];
  const todayUndone = todayTodos.filter((t) => !t.is_done);
  const todayDone = sortDoneByDate(todayTodos.filter((t) => t.is_done));

  // 오른쪽 탭 데이터
  const rightFiltered = sortByDate(
    rightView === "calendar"
      ? []
      : rightView === "all"
        ? (todos ?? [])
        : (todos?.filter((t) =>
            filterByView(t.due_date, rightView as TodoView, t.start_date),
          ) ?? []),
  );
  const rightUndone = rightFiltered.filter((t) => !t.is_done);
  const rightDone = sortDoneByDate(rightFiltered.filter((t) => t.is_done));

  // 모바일 데이터
  const mobileFiltered =
    mobileView === "calendar"
      ? []
      : mobileView === "today"
        ? todayTodos
        : sortByDate(
            mobileView === "all"
              ? (todos ?? [])
              : (todos?.filter((t) =>
                  filterByView(t.due_date, mobileView as TodoView, t.start_date),
                ) ?? []),
          );
  const mobileUndone = mobileFiltered.filter((t) => !t.is_done);
  const mobileDone = sortDoneByDate(mobileFiltered.filter((t) => t.is_done));

  const calendarTodos = selectedDate
    ? (todos?.filter((t) => {
        if (!t.due_date) return false;
        if (t.start_date) {
          return (
            selectedDate >= parseISO(t.start_date) &&
            selectedDate <= parseISO(t.due_date)
          );
        }
        return isSameDay(parseISO(t.due_date), selectedDate);
      }) ?? [])
    : [];

  function makeDragHandler(undone: Todo[]) {
    return (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = undone.findIndex((t) => t.id === active.id);
      const newIndex = undone.findIndex((t) => t.id === over.id);
      const reordered = arrayMove(undone, oldIndex, newIndex);
      updateOrder.mutate(
        reordered.map((todo, index) => ({ id: todo.id, sort_order: index })),
      );
    };
  }

  return (
    <div className="flex w-full flex-col pb-2 md:h-full md:pb-0">
      <div className="mt-4 mb-6 shrink-0">
        <h1 className="text-xl font-bold text-[var(--text)]">할일</h1>
        <p className="mt-1 text-sm text-(--text-subtle)">{todayLabel}</p>
      </div>

      {isLoading ? (
        <p className="py-12 text-center text-sm text-(--text-subtle)">
          불러오는 중...
        </p>
      ) : (
        <>
          {/* ── 모바일 ── */}
          <div className="md:hidden">
            <div className="mb-6 flex rounded-xl bg-[var(--surface)] p-1">
              {mobileTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setMobileView(tab.value)}
                  className={`flex-1 cursor-pointer rounded-lg py-2 text-xs transition-colors ${
                    mobileView === tab.value
                      ? "bg-[var(--accent)] font-medium text-white"
                      : "text-(--text-subtle) hover:text-[var(--text)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {mobileView === "calendar" ? (
              <CalendarView
                todos={todos ?? []}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                calendarTodos={calendarTodos}
              />
            ) : (
              <TodoList
                undone={mobileUndone}
                done={mobileDone}
                filtered={mobileFiltered}
                showAddForm
                showOverdue={mobileView !== "today"}
                sensors={sensors}
                onDragEnd={makeDragHandler(mobileUndone)}
              />
            )}
          </div>

          {/* ── 데스크탑: 리사이즈 2열 ── */}
          <div ref={containerRef} className="hidden min-h-0 flex-1 md:flex">
            {/* 왼쪽: 오늘 */}
            <div
              style={{ width: `${leftWidth}%` }}
              className="min-w-0 overflow-y-auto pr-4"
            >
              <p className="mb-4 text-sm font-semibold text-[var(--text)]">오늘</p>
              <TodoList
                undone={todayUndone}
                done={todayDone}
                filtered={todayTodos}
                showAddForm
                defaultDoneOpen
                sensors={sensors}
                onDragEnd={makeDragHandler(todayUndone)}
              />
            </div>

            {/* 리사이즈 핸들 */}
            <div
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                isDragging.current = true;
                document.body.style.userSelect = "none";
              }}
              onPointerMove={(e) => {
                if (!isDragging.current || !containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
                setLeftWidth(Math.min(75, Math.max(25, newWidth)));
              }}
              onPointerUp={() => {
                isDragging.current = false;
                document.body.style.userSelect = "";
              }}
              className="group relative flex w-4 shrink-0 cursor-col-resize items-center justify-center"
            >
              <div className="h-full w-px bg-[var(--border)] transition-colors group-hover:bg-[var(--accent)]" />
              <div className="absolute flex flex-col gap-1 rounded-full bg-[var(--surface)] px-1 py-2 shadow-sm transition-colors group-hover:bg-[var(--accent)]">
                <span className="block h-px w-2 bg-[var(--text-faint)] group-hover:bg-white" />
                <span className="block h-px w-2 bg-[var(--text-faint)] group-hover:bg-white" />
                <span className="block h-px w-2 bg-[var(--text-faint)] group-hover:bg-white" />
              </div>
            </div>

            {/* 오른쪽: 나머지 탭 */}
            <div
              style={{ width: `${100 - leftWidth}%` }}
              className="min-w-0 overflow-y-auto pl-4"
            >
              <div className="mb-4 flex rounded-xl bg-[var(--surface)] p-1">
                {rightTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setRightView(tab.value)}
                    className={`flex-1 cursor-pointer rounded-lg py-2 text-sm transition-colors ${
                      rightView === tab.value
                        ? "bg-[var(--accent)] font-medium text-white"
                        : "text-(--text-subtle) hover:text-[var(--text)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {rightView === "calendar" ? (
                <CalendarView
                  todos={todos ?? []}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  calendarTodos={calendarTodos}
                />
              ) : (
                <TodoList
                  undone={rightUndone}
                  done={rightDone}
                  filtered={rightFiltered}
                  showDate
                  showOverdue
                  sensors={sensors}
                  onDragEnd={makeDragHandler(rightUndone)}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
