// components/Sidebar.tsx
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="bg-[#003366] text-white w-64 min-h-screen p-4">
      <div className="mb-10">
        {" "}
        {/* mb-6をmb-10に変更 */}
        <img
          src="/image/SyncEra(blue_white).png"
          alt="SyncEra Logo"
          className="h-16 mb-2"
        />
      </div>
      <nav className="space-y-4">
        <Link
          href="/"
          className="block text-white text-lg font-bold hover:underline"
        >
          ホームページへ戻る
        </Link>
      </nav>
    </aside>
  );
}
