import { Sidebar, MobileNav } from "../Navigation";
import { motion } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      <Sidebar />
      <main className="flex-1 lg:ml-72 pb-24 lg:pb-0 min-h-screen overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="container mx-auto max-w-7xl p-4 md:p-8 lg:p-12"
        >
          {children}
        </motion.div>
      </main>
      <MobileNav />
    </div>
  );
}
