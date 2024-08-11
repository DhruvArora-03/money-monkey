import { clerkMiddleware, clerkClient } from "@clerk/nextjs/server";

export default clerkMiddleware((auth, req) => {
  const { userId, redirectToSignIn, sessionClaims } = auth();

  console.log("metadata", sessionClaims?.metadata)
  if (!userId && !req.nextUrl.pathname.startsWith("/sign-in")) {
    redirectToSignIn();
  } else if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    fetch(`${process.env.API_BASE}/users/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).then((res) => {
      console.log("res: ", res.status );
      if (res.status === 201) {
        clerkClient().users.updateUserMetadata(userId, {
          publicMetadata: { onboardingComplete: true },
        });
      } else {
        res.text().then(console.log);
      }
    });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
