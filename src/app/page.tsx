import Chatbox from "@/components/Chatbox/Chatbox";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <main className="relative z-0 flex h-full w-full overflow-hidden flex-col md:flex-row">
      <Sidebar />
      <Header />

      <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden bg-slate-900">
        <div className="relative h-full w-full flex-1  transition-width">
          <Chatbox />
        </div>
      </div>
    </main>
  );
}
