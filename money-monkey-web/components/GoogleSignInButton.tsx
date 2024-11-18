"use client";

import { signIn } from "@/app/login/actions";
import Script from "next/script";

export default function GoogleSignInButton() {
  if (typeof window !== "undefined") {
    window.handleSignInWithGoogle = (response: {
      credential: string;
      select_by: string;
      state?: string;
    }) => signIn(response.credential);
  }

  return (
    <div>
      {/* google sign in  */}
      <Script src="https://accounts.google.com/gsi/client" async></Script>

      <div
        id="g_id_onload"
        data-client_id="616520665199-3qebdmjv33s1nf3b2knk32guaqdkgh6g.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        data-nonce=""
        data-auto_select="true"
        data-itp_support="true"
        data-use_fedcm_for_prompt="true"
      />

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="continue_with"
        data-size="large"
        data-logo_alignment="left"
      />

      {/* <div
        id="g_id_onload"
        data-client_id="616520665199-3qebdmjv33s1nf3b2knk32guaqdkgh6g.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        data-auto_prompt="false"
      />

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      /> */}
    </div>
  );
}
