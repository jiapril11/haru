import Gnb from "./Gnb";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Gnb />
      <Sidebar />
      <main className="ml-56 p-6 pt-14 text-[var(--text)]">{children}</main>
    </div>
  );
}
