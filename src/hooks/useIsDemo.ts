"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useIsDemo() {
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email === process.env.NEXT_PUBLIC_DEMO_EMAIL) {
        setIsDemo(true);
      }
    });
  }, []);

  return isDemo;
}
