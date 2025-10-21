"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  FaFilePdf,
  FaFileWord,
  FaFileCode,
  FaFileAlt,
  FaGlobe,
  FaClock,
  FaFolderOpen,
  FaRedoAlt,
} from "react-icons/fa";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [stats, setStats] = useState<{ project: string; date: string; duration: number } | null>(
    null
  );
  const router = useRouter();

  // ✅ تحقق من أن المستخدم مسجل دخول
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first!");
      router.push("/login");
    }
  }, [router]);

  // 🧠 رفع الملف ومعالجة النتائج
  const handleUpload = async () => {
    if (!file) return toast.error("Please select a ZIP file first.");

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized! Please log in again.");
      router.push("/login");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const start = Date.now();
    try {
      const res = await axios.post("http://localhost:5134/api/readme/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const duration = ((Date.now() - start) / 1000).toFixed(1);
      const projectName = file.name.replace(".zip", "");
      const date = new Date().toLocaleString();

      setStats({ project: projectName, date, duration: parseFloat(duration) });
      setResults(res.data);
      toast.success("✅ README generated successfully!");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        toast.error("Generation failed. Check server connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 📦 تحميل ملف من السيرفر
  const handleDownload = async (filePath: string) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login again.");

    try {
      const res = await axios.get("http://localhost:5134/api/readme/download", {
        params: { path: filePath },
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filePath.split("/").pop() || "file");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("⬇️ File downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Download failed.");
    }
  };

  // 🔁 إعادة التهيئة لتجربة مشروع جديد
  const handleReset = () => {
    setFile(null);
    setResults(null);
    setStats(null);
    toast("Ready for a new project!", { icon: "🔁" });
  };

  // 🧩 أيقونة حسب نوع الملف
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return <FaFilePdf className="text-red-500 text-xl" />;
      case "docx":
        return <FaFileWord className="text-blue-600 text-xl" />;
      case "html":
        return <FaGlobe className="text-orange-500 text-xl" />;
      case "md":
        return <FaFileCode className="text-gray-700 text-xl" />;
      default:
        return <FaFileAlt className="text-gray-500 text-xl" />;
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <Toaster position="top-center" />
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Upload Your Project ZIP
        </h2>

        {/* 🧭 Zone الرفع */}
        {!results && (
          <>
            <div className="mb-4">
              <input
                type="file"
                accept=".zip"
                className="border border-gray-300 rounded-lg p-3 w-full text-gray-600 cursor-pointer hover:border-blue-400 transition"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md"
              }`}
            >
              {loading ? "Generating..." : "Generate README"}
            </button>
          </>
        )}

        {/* 🔹 معلومات المشروع */}
        {stats && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-2 text-blue-700">
              <FaFolderOpen className="text-xl" />
              <span className="font-semibold text-lg">{stats.project}</span>
            </div>
            <div className="text-sm text-gray-700 flex items-center gap-2">
              <FaClock className="text-blue-500" /> Generated on{" "}
              <span className="font-medium">{stats.date}</span> ⏱️ Duration:{" "}
              <span className="font-medium">{stats.duration}s</span>
            </div>
          </div>
        )}

        {/* 🔹 قائمة الملفات الناتجة */}
        {results && (
          <>
            <div className="mt-8 border-t pt-4">
              <h3 className="font-semibold mb-4 text-gray-800 text-lg flex items-center gap-2">
                📂 Generated Files:
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {results.outputs?.map((f: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-2 hover:bg-gray-200 transition shadow-sm"
                  >
                    <div className="flex items-center gap-3 truncate">
                      {getFileIcon(f.name)}
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {f.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownload(f.path)}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg hover:opacity-90 text-sm font-semibold shadow-sm"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔁 Try Another Project */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold shadow-sm transition"
              >
                <FaRedoAlt className="text-gray-600" />
                Try Another Project
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
