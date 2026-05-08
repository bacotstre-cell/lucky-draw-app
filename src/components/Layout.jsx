import { useState } from "react"
import { Menu, Users, Shuffle, Group, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Input Nama", href: "/", icon: Users },
  { name: "Pengundian", href: "/draw", icon: Shuffle },
  { name: "Pembagian Kelompok", href: "/groups", icon: Group },
  { name: "Undian Serentak", href: "/simultaneous", icon: Zap },
]

export function Layout({ children, currentPath }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card/70 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center h-16 px-6 border-b border-white/10">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            LuckyDraw
          </span>
        </div>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault()
                window.history.pushState({}, "", item.href)
                window.dispatchEvent(new PopStateEvent("popstate"))
                setSidebarOpen(false)
              }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                currentPath === item.href
                  ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 flex items-center px-6 border-b border-white/10 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {navigation.find(n => n.href === currentPath)?.name ?? "Lucky Draw"}
          </h1>
        </header>
        
        <main className="flex-1 p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>

        {/* FOOTER BARU */}
        <footer className="border-t border-white/10 py-4 px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 <span className="text-purple-400 font-medium">L. Firman Nawa</span>. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}