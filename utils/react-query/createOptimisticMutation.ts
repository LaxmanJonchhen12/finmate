import { QueryClient } from "@tanstack/react-query";

type OptimisticConfig<TData, TVariables> = {
  queryKey: unknown[];

  // how to update cache optimistically
  updater: (old: TData[] | undefined, variables: TVariables) => TData[];

  // optional rollback snapshot
  snapshot?: boolean;
};

export function createOptimisticMutation<TData, TVariables>(
  queryClient: QueryClient,
  config: OptimisticConfig<TData, TVariables>,
) {
  return {
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey: config.queryKey });

      const previousData = queryClient.getQueryData<TData[]>(config.queryKey);

      queryClient.setQueryData<TData[]>(config.queryKey, (old) =>
        config.updater(old, variables),
      );

      return { previousData };
    },

    onError: (
      _err: unknown,
      _variables: TVariables,
      context: { previousData: TData[] | undefined },
    ) => {
      if (context?.previousData) {
        queryClient.setQueryData(config.queryKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: config.queryKey });
    },
  };
}
