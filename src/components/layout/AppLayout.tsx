import Gnb from './Gnb';
import Sidebar from './Sidebar';

export default function AppLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-[#0d0d1a]">
        <Gnb />
        <Sidebar />
        <main className="ml-56 pt-14 p-6 text-white">
          {children}
        </main>
      </div>
  );
}
