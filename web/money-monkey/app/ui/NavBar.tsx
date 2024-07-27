import { SignedIn, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";

export default function NavBar() {
  return (
    <nav className="flex items-center text-white flex-wrap gap-4 w-screen bg-gray-800 p-6">
      <div>
        <span className="font-semibold text-xl">Money Monkey</span>
      </div>
      <a href="home">Home</a>
      <div className="flex-grow text-right">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </nav>
  );
}
