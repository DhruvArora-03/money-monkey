import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { createUser } from "@lib/db/user";

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn, sessionClaims } = auth();

  if (!userId && !req.nextUrl.pathname.startsWith("/sign-in")) {
    redirectToSignIn();
  } else if (userId && !sessionClaims.metadata.onboardingComplete) {
    await createUser(userId);
    clerkClient().users.updateUserMetadata(userId, {
      publicMetadata: { onboardingComplete: true },
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
