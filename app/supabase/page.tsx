"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function TestPage() {
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("transactions")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    };

    fetchData();
  }, []);

  return <div>Check console</div>;
}