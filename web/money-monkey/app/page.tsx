import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function EntryPage() {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  );
}
