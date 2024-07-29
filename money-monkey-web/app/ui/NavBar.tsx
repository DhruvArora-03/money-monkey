import { SignedIn, UserButton } from "@clerk/nextjs";

export default function NavBar() {
  return (
    <nav className="flex items-center text-white flex-wrap gap-4 w-screen bg-gray-800 p-6">
      <a href="/" className="font-semibold text-xl">
        Money Monkey
      </a>
      <a href="/">Home</a>
      <div className="flex-grow text-right">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
