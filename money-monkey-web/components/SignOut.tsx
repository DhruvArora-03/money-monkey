"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const supabase = createClient();
  const router = useRouter();
  return (
    <form>
      <button
        onClick={() => {
          supabase.auth.signOut().then(() => router.push("/login"));
        }}
      >
        logout
      </button>
    </form>
  );
}
