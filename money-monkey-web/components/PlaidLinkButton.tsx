"use client";

import { usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/ui/button";
import { exchangeToken } from "@/lib/plaidActions";
import { MdAdd } from "react-icons/md";

export default function PlaidLinkButton(props: {
  className?: string;
  linkToken: string;
}) {
  const { open, ready } = usePlaidLink({
    token: props.linkToken,
    onSuccess: exchangeToken,
  });

  return (
    <Button
      className={props.className}
      onClick={() => {
        open();
      }}
      disabled={!props.linkToken || !ready}
    >
      {props.linkToken && ready ? (
        <>
          <MdAdd /> Link New Account
        </>
      ) : (
        "Loading..."
      )}
    </Button>
  );
}
