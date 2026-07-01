import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../service/category.service";
import { useAuth } from "../../auth/hooks/useAuth";

export function useGetCategories() {
  const { data: user } = useAuth();

  return useQuery({
    queryKey: ["categories", user?.id],
    queryFn: () => getCategories(user!.id),
    enabled: !!user?.id,
  });
}
