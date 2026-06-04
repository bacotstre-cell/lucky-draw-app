import { useState, useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Import, AlignLeft } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export function ImportTextarea({ onImport }) {
  const [text, setText] = useState("")

  // Real-time parsing: Mendeteksi nama secara otomatis saat user mengetik
  // Menggunakan regex untuk memisahkan berdasarkan baris baru (\n) ATAU koma (,)
  const parsedNames = useMemo(() => {
    if (!text.trim()) return []
    return text
      .split(/[\n,]+/)
      .map((line) => line.trim())
      .filter((line) => line !== "")
  }, [text])

  const handleImport = () => {
    if (parsedNames.length === 0) {
      toast.error("Teks kosong, tidak ada nama yang valid untuk diimpor.")
      return
    }
    
    // Opsional: Hapus duplikat secara internal untuk kenyamanan ekstra
    const uniqueNames = Array.from(new Set(parsedNames))
    
    onImport(uniqueNames)
    setText("")
    toast.success(`${uniqueNames.length} nama berhasil diimpor ke dalam daftar.`)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (parsedNames.length > 0) {
        handleImport()
      }
    }
  }

  return (
    <div className="space-y-3 relative group">
      {/* Container dengan efek glow saat fokus */}
      <div className="relative rounded-xl border border-white/10 bg-secondary/20 transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:border-purple-500/50 overflow-hidden">
        
        <Textarea
          placeholder="Paste nama di sini... (Pisahkan dengan baris baru atau koma)"
          aria-label="Area teks untuk import nama massal"
          className="min-h-[160px] bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/50 resize-y p-4 text-sm leading-relaxed"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        {/* Live Feedback Footer di dalam Textarea */}
        <div className="flex items-center justify-between px-4 py-3 bg-secondary/30 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <AlignLeft className="h-4 w-4 opacity-50" />
            <AnimatePresence mode="popLayout">
              {parsedNames.length > 0 ? (
                <motion.span
                  key="has-names"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-purple-400"
                >
                  {parsedNames.length} nama terdeteksi
                </motion.span>
              ) : (
                <motion.span
                  key="no-names"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  0 nama terdeteksi
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <Button 
            onClick={handleImport} 
            disabled={parsedNames.length === 0}
            aria-keyshortcuts="Control+Enter"
            className="gap-2 bg-purple-600 hover:bg-purple-500 text-white h-8 text-xs px-3 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:shadow-none transition-all duration-300"
          >
            <Import className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Import</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded border border-white/20 bg-black/20 text-[10px] font-mono">
              <span className="text-xs">⌘</span>↵
            </kbd>
          </Button>
        </div>
      </div>
    </div>
  )
}