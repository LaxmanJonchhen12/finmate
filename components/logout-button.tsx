import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";

export default function LogoutButton() {
      const router = useRouter();
            const supabase = createClient();
            const queryClient = useQueryClient();

            async function handleLogout() {
              try {
                const { error } = await supabase.auth.signOut();
                if (error) {
                  throw error;
                }
                queryClient.clear();
                toast.success("Logged out successfully!");
                router.replace("/login");
              } catch (error) {
                console.error("Error logging out:", error);
                toast.error("Error logging out. Please try again.");
              }
            }
          
    return(
        <AlertDialog>
           <AlertDialogTrigger render={<Button variant="destructive">
                    Logout
                </Button>} />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will log you out of your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                        Logout
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}