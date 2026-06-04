import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, History } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function HistoryList({ winners, onClear }) {
  // Memoisasi agar operasi reverse tidak dijalankan ulang setiap render
  const reversedWinners = useMemo(() => {
    return [...winners].reverse()
  }, [winners])

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header Riwayat */}
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-200 uppercase tracking-wider">
          <History className="h-4 w-4 text-purple-400" />
          Riwayat Pemenang
        </h3>
        
        {winners.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            aria-label="Hapus semua riwayat pemenang"
            className="h-8 px-2 text-xs text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5 sm:mr-1.5" /> 
            <span className="hidden sm:inline">Kosongkan</span>
          </Button>
        )}
      </div>

      {/* Konten Riwayat */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {reversedWinners.length === 0 ? (
            // Empty State
            <motion.div
              key="empty-history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-muted-foreground py-12 space-y-3"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <History className="h-5 w-5 text-zinc-600" />
              </div>
              <p className="text-sm font-medium">Belum ada aktivitas.</p>
            </motion.div>
          ) : (
            // Semantic List untuk A11Y
            <ul className="grid gap-2" role="list">
              {reversedWinners.map((winner) => (
                <motion.li
                  // Menggunakan kombinasi unik untuk Key, BUKAN index
                  key={`${winner.name}-${winner.timestamp}`}
                  layout
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="group flex justify-between items-center p-3.5 bg-card/40 hover:bg-card/60 backdrop-blur-md rounded-xl border border-white/5 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    <span className="font-semibold text-slate-200 truncate">
                      {winner.name}
                    </span>
                  </div>
                  
                  {/* Font Monospace untuk konsistensi angka waktu */}
                  <span className="text-[11px] font-mono font-medium text-zinc-500 bg-black/20 px-2 py-1 rounded-md shrink-0">
                    {new Date(winner.timestamp).toLocaleTimeString("id-ID", { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      second: '2-digit' 
                    })}
                  </span>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}