"use client";

import { usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { exchangeToken, getLinkToken } from "@/app/plaid/actions";
import { createClient } from "@/lib/supabase/client";
import { MdAdd } from "react-icons/md";

export default function PlaidLinkButton({ className }: { className?: string }) {
  const supabase = createClient();
  const userIdPromise = supabase.auth.getUser();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  useEffect(() => {
    userIdPromise
      .then((res) => getLinkToken(res.data.user!.id))
      .then((token) => setLinkToken(token));
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token) =>
      userIdPromise.then((res) =>
        exchangeToken(res.data.user!.id, public_token)
      ),
  });

  return (
    <div className={className}>
      <Button onClick={() => open()} disabled={!linkToken || !ready}>
        {linkToken && ready ? (
          <>
            <MdAdd /> Link New Account
          </>
        ) : (
          "Loading..."
        )}
      </Button>
    </div>
  );
}
