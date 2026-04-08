import Gnb from "./Gnb";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Gnb />
      <Sidebar />
      <main className="pt-14 p-4 md:ml-56 md:p-6 pb-20 md:pb-6 text-[var(--text)]">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
