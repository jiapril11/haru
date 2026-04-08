"use client";

import { Todo } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TodoItem from "./TodoItem";

type Props = {
  todo: Todo;
};

export default function SortableTodoItem({ todo }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center gap-2">
        {/* 드래그 핸들 */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none px-1 text-[var(--text-faint)] hover:text-[var(--text-muted)] active:cursor-grabbing"
        >
          ⠿
        </button>
        <div className="flex-1">
          <TodoItem todo={todo} />
        </div>
      </div>
    </div>
  );
}
