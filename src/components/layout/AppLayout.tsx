import Gnb from "./Gnb";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Gnb />
      <Sidebar />
      <main className="h-dvh overflow-y-auto px-4 pt-14 pb-20 text-[var(--text)] md:ml-56 md:px-6 md:pb-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
