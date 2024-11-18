import { signOut } from "@/app/login/actions";

export default function NavBar() {
  return (
    <nav className="sticky z-10 top-0 flex items-center text-white flex-wrap gap-4 w-screen bg-gray-800 p-6">
      <a href="/" className="font-semibold text-xl">
        Money Monkey
      </a>
      <a href="/">Home</a>
      <div className="flex-grow text-right">get a new profile icon</div>
      <form>
        <button formAction={signOut}>logout</button>
      </form>
    </nav>
  );
}
