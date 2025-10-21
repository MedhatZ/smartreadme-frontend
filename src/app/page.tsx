import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-center px-6">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
        Turn Your Code into <span className="text-blue-600">Beautiful Docs</span> ✨
      </h1>

      <p className="text-gray-600 text-lg max-w-2xl mb-10">
        Upload your project ZIP file and get an instant, multilingual README with exports to
        PDF, DOCX, and HTML — all offline, 100% private.
      </p>

      <Link
        href="/upload"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-md"
      >
        Try it Free →
      </Link>

      <p className="text-gray-400 mt-4">No sign-in required • Free for 3 generations</p>
    </main>
  );
}
