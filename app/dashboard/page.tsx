"use client";
import { Button } from "@base-ui/react";
import { useSignOut } from "../features/auth/hooks/useLogout";

export default function Daahboard() {
  const { mutate: logout, isPending } = useSignOut();
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <Button
        onClick={() => {
          logout();
        }}
        disabled={isPending}
      >
        Logout
      </Button>
    </div>
  );
}
