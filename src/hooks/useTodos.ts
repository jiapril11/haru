import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Todo } from "@/types";
import { useQuery } from "@tanstack/react-query";

async function fetchTodos(): Promise<todo[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
}

export function useAddTodo() {
  const QueryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (todo: Pick<Todo, "title" | "priority" | "due_date">) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다");
      const { error } = await supabase.from("todos").insert({
        ...todo,
        user_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => QueryClient.invalidateQueries({ queryKey: ["todos"] }),
  });
}

export function useToggleTodo() {
  const QueryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, is_done }: { id: string; is_done: boolean }) => {
      const { error } = await supabase
        .from("todos")
        .update({ is_done })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => QueryClient.invalidateQueries({ queryKey: ["todos"] }),
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });
}

export function useUpdateTodoOrder() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (todos: Pick<Todo, "id" | "sort_order">[]) => {
      const updates = todos.map(({ id, sort_order }) =>
        supabase.from("todos").update({ sort_order }).eq("id", id),
      );
      await Promise.all(updates);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });
}
