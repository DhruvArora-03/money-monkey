export default function NavBar() {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">
          Money Monkey
        </span>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <a
          href="#"
          className="block mt-4 lg:inline-block lg:mt-0 text-white mr-4 hover:text-gray-200"
        >
          Home
        </a>
        <a
          href="#"
          className="block mt-4 lg:inline-block lg:mt-0 text-white mr-4 hover:text-gray-200"
        >
          Profile
        </a>
      </div>
    </nav>
  );
}
