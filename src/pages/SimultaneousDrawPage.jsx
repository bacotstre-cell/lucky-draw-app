import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Zap, Download } from "lucide-react"
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
  const [names, setNames] = useState("")
  const [drawCount, setDrawCount] = useState(1)
  const [winners, setWinners] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const rollingRef = useRef(null)

  const getNamesArray = () =>
    names
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n !== "")

  const handleLoadGlobal = () => {
    if (globalParticipants.length === 0) {
      toast.error("Daftar peserta global kosong.")
      return
    }
    setNames(globalParticipants.join("\n"))
    toast.success("Daftar peserta global dimuat.")
  }

  const handleDraw = () => {
    const nameList = getNamesArray()
    if (nameList.length === 0) {
      toast.error("Tidak ada nama untuk diundi.")
      return
    }
    const count = parseInt(drawCount, 10)
    if (isNaN(count) || count < 1) {
      toast.error("Jumlah undian minimal 1.")
      return
    }
    if (count > nameList.length) {
      toast.error("Jumlah undian melebihi jumlah nama.")
      return
    }

    setIsDrawing(true)
    setWinners([])

    // Animasi rolling text selama ±2 detik
    let ticks = 0
    const maxTicks = 40
    rollingRef.current = setInterval(() => {
      const shuffled = shuffleArray(nameList)
      const slice = shuffled.slice(0, count)
      setWinners(slice)
      ticks++
      if (ticks >= maxTicks) {
        clearInterval(rollingRef.current)
        // Hasil final
        const finalShuffled = shuffleArray(nameList)
        const finalWinners = finalShuffled.slice(0, count)
        setWinners(finalWinners)
        setIsDrawing(false)
        toast.success(`${count} pemenang terpilih!`)
      }
    }, 50)
  }

  // Cleanup interval
  const handleReset = () => {
    clearInterval(rollingRef.current)
    setIsDrawing(false)
    setWinners([])
  }

  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-card/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-400" />
            Undian Serentak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Daftar Nama (satu per baris)
            </label>
            <Textarea
              placeholder="Paste nama di sini..."
              className="min-h-[150px] bg-secondary/50 border-white/10 placeholder:text-muted-foreground/60 resize-none"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              disabled={isDrawing}
            />
            <div className="mt-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadGlobal}
                disabled={isDrawing}
                className="gap-2"
              >
                <Download className="h-3 w-3" /> Gunakan Daftar Peserta Global
              </Button>
              <div className="flex-1" />
              <span className="text-xs text-muted-foreground self-end">
                {getNamesArray().length} nama
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1 block">
                Jumlah yang Diundi
              </label>
              <Input
                type="number"
                min={1}
                max={getNamesArray().length || 1}
                value={drawCount}
                onChange={(e) => setDrawCount(e.target.value)}
                className="bg-secondary/50 border-white/10 w-full sm:w-32"
                disabled={isDrawing}
              />
            </div>
            <div className="flex gap-2">
              {isDrawing ? (
                <Button onClick={handleReset} variant="destructive" className="gap-2">
                  Batalkan
                </Button>
              ) : (
                <Button onClick={handleDraw} className="gap-2 bg-yellow-600 hover:bg-yellow-700 text-white">
                  Undi Serentak
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {winners.length > 0 && (
          <motion.div
            key="winners"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {winners.map((name, index) => ( <motion.div
    key={name + index}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="relative border-yellow-400/30 bg-yellow-500/10 backdrop-blur-sm text-center">
      {/* Nomor pemenang */}
      <span className="absolute top-2 left-2 text-xs font-bold text-yellow-400/80 bg-black/30 rounded-full w-6 h-6 flex items-center justify-center">
        {index + 1}
      </span>
      <CardContent className="py-6">
        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
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