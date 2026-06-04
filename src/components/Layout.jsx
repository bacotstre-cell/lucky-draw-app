import { useState, useEffect } from "react"
import { Menu, Users, Shuffle, Group, Zap, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
  { name: "Input Nama", href: "/", icon: Users },
  { name: "Pengundian", href: "/draw", icon: Shuffle },
  { name: "Pembagian Kelompok", href: "/groups", icon: Group },
  { name: "Undian Serentak", href: "/simultaneous", icon: Zap },
]

export function Layout({ children, currentPath }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Prevent background scrolling when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [sidebarOpen])

  // Handle ESC key to close sidebar
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSidebarOpen(false)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  return (
    <div className="min-h-screen flex bg-[#09090b] text-slate-50 selection:bg-purple-500/30 font-sans">
      
      {/* Mobile Overlay with Framer Motion & A11Y */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-zinc-950/50 backdrop-blur-2xl border-r border-white/5 flex flex-col transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Main Navigation"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
          <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
            SMAMUH KOTER
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-slate-400 hover:text-white hover:bg-white/10" 
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const isActive = currentPath === item.href
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  window.history.pushState({}, "", item.href)
                  window.dispatchEvent(new PopStateEvent("popstate"))
                  setSidebarOpen(false)
                }}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                {/* Active Indicator (Linear/Vercel Style) */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-white/10 rounded-lg border border-white/5"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon 
                  className={cn(
                    "h-4 w-4 relative z-10 transition-colors", 
                    isActive ? "text-purple-400" : "text-zinc-500 group-hover:text-zinc-300"
                  )} 
                />
                <span className="relative z-10">{item.name}</span>
              </a>
            )
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="sticky top-0 z-30 h-16 flex items-center px-4 md:px-8 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden mr-3 text-slate-300 hover:bg-white/10" 
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center text-sm font-medium text-slate-300">
            <span className="hidden sm:inline-block mr-2 text-slate-500">Menu /</span>
            {navigation.find(n => n.href === currentPath)?.name ?? "Dashboard"}
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col">
          {/* Page Transition Wrapper */}
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </main>

        <footer className="py-6 px-6 text-center border-t border-white/5 mt-auto bg-black/20">
          <p className="text-xs font-medium text-zinc-500 tracking-wide">
            © 2026 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">by L Firman Nawa</span>. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}