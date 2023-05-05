import { PostgrestError } from "@supabase/supabase-js";
import { QUERY_KEYS } from ".";
import { useSupabase } from "../shared/supabase.provider";
import { DatabaseTables, ExerciseTable } from "../shared/types/database";

import { ExerciseRow } from "../shared/types/database";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { mapFormObjectToExerciseRow } from "../shared/utils";
import HttpStatusCode from "../shared/http-status-codes";
import { ExerciseSchema } from "../shared/validation/exercise";

export const useExercises = () => {
  const { client } = useSupabase();

  const clientQuery = client
    ?.from<DatabaseTables.EXERCISES, ExerciseTable>(
      DatabaseTables.EXERCISES
    )
    .select("*")
    .order("name", { ascending: true });

  const { data, isLoading, isStale } = useQuery<
    { exercises: ExerciseRow[] },
    PostgrestError,
    { exercises: ExerciseRow[] }
  >([QUERY_KEYS.exercises], async () => {
    const response = await clientQuery;

    return {
      exercises: response?.data ?? [],
    };
  });

  return { data, isLoading, isStale };
};

export const useMutateExercises = () => {
  const { client } = useSupabase();
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    [QUERY_KEYS.exercises],
    async (exercise: ExerciseSchema) => {
      const response = await client
        ?.from<DatabaseTables.EXERCISES, ExerciseTable>(
          DatabaseTables.EXERCISES
        )
        .insert(mapFormObjectToExerciseRow(exercise));

      return {
        status: response?.status,
        statusText: response?.statusText,
        error: response?.error,
      };
    },
    {
      onSuccess: data => {
        if (data.status === HttpStatusCode.CREATED) {
          return queryClient.invalidateQueries([QUERY_KEYS.clients]);
        }
      },
    }
  );

  const updateMutation = useMutation(
    [QUERY_KEYS.exercises],
    async ({ id, exercise }: { id: string; exercise: ExerciseSchema }) => {
      const response = await client
        ?.from<DatabaseTables.EXERCISES, ExerciseTable>(
          DatabaseTables.EXERCISES
        )
        .update(mapFormObjectToExerciseRow(exercise))
        .eq("id", id);
      console.log("resp", response);
      return {
        status: response?.status,
        statusText: response?.statusText,
        error: response?.error,
      };
    },
    {
      onSuccess: (data, { id }) => {
        if (data.status === HttpStatusCode.NO_CONTENT) {
          return queryClient.invalidateQueries([QUERY_KEYS.exercises, id]);
        }
      },
    }
  );

  const deleteMutation = useMutation(
    [QUERY_KEYS.exercises],
    async (id: string) => {
      const response = await client
        ?.from<DatabaseTables.EXERCISES, ExerciseTable>(
          DatabaseTables.EXERCISES
        )
        .delete()
        .eq("id", id);
      return {
        status: response?.status,
        statusText: response?.statusText,
        error: response?.error,
      };
    },
    {
      onSuccess: data => {
        if (data.status === HttpStatusCode.NO_CONTENT) {
          return queryClient.invalidateQueries([QUERY_KEYS.exercises]);
        }
      },
    }
  );

  return {
    createExercise: createMutation.mutate,
    createExerciseAsync: createMutation.mutateAsync,
    updateExercise: updateMutation.mutate,
    updateExerciseAsync: updateMutation.mutateAsync,
    deleteExercise: deleteMutation.mutate,
    deleteExerciseAsync: deleteMutation.mutateAsync,
    isCreatingExercise: createMutation.isLoading,
    isUpdatingExercise: updateMutation.isLoading,
    isDeletingExercise: deleteMutation.isLoading,
  };
};
