import { useMutation } from "@tanstack/react-query";
import { signOut } from "../service/auth.service";

export function useSignOut() {
  return useMutation({
    mutationFn: signOut,
  });
}
