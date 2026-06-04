import { useState, useRef, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Zap, Download, XCircle, Trophy } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { STORAGE_KEYS } from "@/utils/storage"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function SimultaneousDrawPage() {
  const [globalParticipants] = useLocalStorage(STORAGE_KEYS.PARTICIPANTS, [])
  const [names, setNames] = useLocalStorage(STORAGE_KEYS.SIMULTANEOUS_DRAFT, "")
  const [drawCount, setDrawCount] = useLocalStorage(STORAGE_KEYS.SIMULTANEOUS_COUNT, 1)
  
  const [winners, setWinners] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const rollingRef = useRef(null)

  // Optimasi: Parsing nama hanya dijalankan jika 'names' text berubah
  const parsedNames = useMemo(() => {
    if (!names) return []
    return names
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n !== "")
  }, [names])

  // Cleanup interval saat unmount (Mencegah Memory Leak)
  useEffect(() => {
    return () => clearInterval(rollingRef.current)
  }, [])

  const handleLoadGlobal = () => {
    if (globalParticipants.length === 0) {
      toast.error("Daftar peserta global kosong.")
      return
    }
    // Hapus duplikat otomatis saat import
    const uniqueGlobal = Array.from(new Set(globalParticipants))
    setNames(uniqueGlobal.join("\n"))
    toast.success("Daftar peserta global berhasil dimuat.")
  }

  const handleDraw = () => {
    if (parsedNames.length === 0) {
      toast.error("Tidak ada nama valid untuk diundi.")
      return
    }
    
    const count = parseInt(drawCount, 10)
    if (isNaN(count) || count < 1) {
      toast.error("Jumlah undian minimal 1.")
      return
    }
    if (count > parsedNames.length) {
      toast.error(`Jumlah undian (${count}) melebihi jumlah peserta (${parsedNames.length}).`)
      return
    }

    setIsDrawing(true)
    // Pre-fill array agar grid langsung muncul (memicu animasi enter sekali saja)
    setWinners(Array(count).fill("Mengacak..."))

    let ticks = 0
    const maxTicks = 40 // Durasi total: 40 * 60ms = 2.4 detik

    // Menggunakan interval 60ms (sedikit lebih stabil mendekati 60fps)
    rollingRef.current = setInterval(() => {
      const shuffled = shuffleArray(parsedNames)
      setWinners(shuffled.slice(0, count))
      ticks++
      
      if (ticks >= maxTicks) {
        clearInterval(rollingRef.current)
        // Eksekusi final
        const finalShuffled = shuffleArray(parsedNames)
        const finalWinners = finalShuffled.slice(0, count)
        setWinners(finalWinners)
        setIsDrawing(false)
        toast.success(`${count} pemenang berhasil terpilih!`)
      }
    }, 60)
  }

  const handleReset = () => {
    clearInterval(rollingRef.current)
    setIsDrawing(false)
    setWinners([])
    toast.info("Pengundian dibatalkan.")
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 w-full">
      
      {/* Panel Setup */}
      <Card className="border-white/10 bg-card/40 backdrop-blur-xl shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Zap className="h-5 w-5 text-amber-400" />
            Undian Serentak
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="simultaneous-names" className="text-sm font-medium text-slate-300">
                Daftar Peserta
              </label>
              <span className="text-xs font-medium px-2 py-1 bg-white/10 rounded-md text-slate-300">
                {parsedNames.length} Total
              </span>
            </div>
            
            <Textarea
              id="simultaneous-names"
              placeholder="Paste nama di sini (pisahkan dengan enter atau koma)..."
              className="min-h-[120px] bg-black/20 border-white/10 focus-visible:ring-amber-500/50 resize-y"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              disabled={isDrawing}
              aria-label="Input daftar nama untuk undian serentak"
            />
            
            <div className="flex justify-start pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLoadGlobal}
                disabled={isDrawing}
                className="gap-2 text-xs bg-white/5 hover:bg-white/10 border border-white/5"
              >
                <Download className="h-3.5 w-3.5 text-amber-400" /> 
                Muat dari Data Global
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end pt-2 border-t border-white/5">
            <div className="flex-1 w-full space-y-2">
              <label htmlFor="draw-count" className="text-sm font-medium text-slate-300">
                Jumlah Pemenang (Diundi Sekaligus)
              </label>
              <Input
                id="draw-count"
                type="number"
                min={1}
                max={parsedNames.length || 1}
                value={drawCount}
                onChange={(e) => setDrawCount(e.target.value)}
                className="bg-black/20 border-white/10 w-full sm:w-40 text-lg font-medium focus-visible:ring-amber-500/50"
                disabled={isDrawing}
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              {isDrawing ? (
                <Button 
                  onClick={handleReset} 
                  variant="destructive" 
                  className="gap-2 w-full sm:w-auto font-medium"
                >
                  <XCircle className="h-4 w-4" /> Batalkan
                </Button>
              ) : (
                <Button 
                  onClick={handleDraw} 
                  className="gap-2 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(217,119,6,0.5)] transition-all"
                >
                  <Zap className="h-4 w-4" /> Undi Serentak
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screen Reader Announcement */}
      <div aria-live="polite" className="sr-only">
        {!isDrawing && winners.length > 0 ? `Undian selesai. ${winners.length} pemenang terpilih.` : ""}
      </div>

      {/* Panggung Pemenang (Grid) */}
      <AnimatePresence mode="wait">
        {winners.length > 0 && (
          <motion.div
            key="winners-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-hidden={isDrawing} // Sembunyikan dari SR saat sedang acak
          >
            {winners.map((name, index) => (
              // KEY PENTING: Gunakan 'index' agar elemen tidak di-remount berulang kali saat mengacak
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.05, // Efek gelombang/stagger saat pertama kali muncul
                  type: "spring", stiffness: 300, damping: 25 
                }}
              >
                <Card 
                  className={`relative overflow-hidden transition-all duration-200 border-white/5 ${
                    isDrawing 
                      ? "bg-white/5 backdrop-blur-md opacity-80" // Mode rolling: redup
                      : "bg-gradient-to-br from-amber-500/20 to-orange-600/10 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]" // Mode final: menyala
                  }`}
                >
                  {/* Dekorasi Nomor Urut */}
                  <div className="absolute top-0 left-0 bg-black/40 backdrop-blur-sm rounded-br-xl px-3 py-1 flex items-center gap-1 border-b border-r border-white/10 z-10">
                    <Trophy className={`h-3 w-3 ${isDrawing ? 'text-zinc-500' : 'text-amber-400'}`} />
                    <span className="text-[10px] font-bold text-slate-300">{index + 1}</span>
                  </div>

                  <CardContent className="p-6 flex items-center justify-center min-h-[120px]">
                    <div 
                      className={`text-2xl lg:text-3xl font-black text-center transition-all duration-100 line-clamp-2 ${
                        isDrawing 
                          ? "text-zinc-500 blur-[1px]" // Blur halus saat mengacak
                          : "text-transparent bg-clip-text bg-gradient-to-br from-amber-300 to-orange-500 drop-shadow-sm" // Emas menyala saat final
                      }`}
                    >
                      {name}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}