"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">
        SmartReadme.AI
      </Link>

      <div className="space-x-4">
        <Link href="/upload" className="text-gray-700 hover:text-blue-600">
          Upload
        </Link>
        <button
          onClick={logout}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
