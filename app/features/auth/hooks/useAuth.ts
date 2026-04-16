import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
export function useAuth() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
    staleTime: Infinity, // user doesn't change often
  });
}
