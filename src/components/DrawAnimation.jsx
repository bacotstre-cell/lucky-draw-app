import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"

export function DrawAnimation({ participants, onComplete }) {
  const [currentName, setCurrentName] = useState("")
  const [isRolling, setIsRolling] = useState(false)
  const [winner, setWinner] = useState(null)
  
  const intervalRef = useRef(null)

  const startDraw = () => {
    if (participants.length === 0 || isRolling) return
    
    setIsRolling(true)
    setWinner(null) // Reset pemenang jika diulang
    
    let counter = 0
    const durationTicks = 35 // Sekitar 2.8 detik (35 * 80ms)
    
    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * participants.length)
      setCurrentName(participants[randomIndex])
      counter++
      
      if (counter > durationTicks) {
        clearInterval(intervalRef.current)
        const finalWinner = participants[Math.floor(Math.random() * participants.length)]
        setCurrentName(finalWinner)
        setWinner(finalWinner)
        setIsRolling(false)
        onComplete(finalWinner)
      }
    }, 80)
  }

  // Cleanup yang aman saat komponen di-unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-10 w-full min-h-[300px] py-10 relative">
      
      {/* Pengumuman Pembaca Layar (Visually Hidden) */}
      <div aria-live="polite" className="sr-only">
        {winner ? `Pemenangnya adalah ${winner}!` : isRolling ? "Sedang mengacak nama..." : ""}
      </div>

      <div className="relative w-full flex items-center justify-center h-32 md:h-48" aria-hidden="true">
        <AnimatePresence mode="wait">
          {!isRolling && !winner ? (
            // State Awal (Empty State Modern)
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-700/50 flex items-center gap-4"
            >
              <Sparkles className="h-10 w-10 text-zinc-700/30" />
              Siap Diundi
            </motion.div>
          ) : isRolling ? (
            // State Mengacak (Cepat, tanpa enter/exit animation pada setiap nama untuk menjaga 60fps)
            <motion.div
              key="rolling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-5xl md:text-7xl font-black text-center text-zinc-400 blur-[1px]"
            >
              {currentName}
            </motion.div>
          ) : (
            // State Pemenang Final (Selebrasi Mewah)
            <motion.div
              key="winner"
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: { type: "spring", stiffness: 250, damping: 15 }
              }}
              className="relative text-6xl md:text-8xl font-black text-center"
            >
              {/* Efek Glow Latar Belakang (Aman untuk Safari/iOS) */}
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 blur-2xl opacity-40 rounded-full mix-blend-screen scale-110" />
              
              {/* Teks Gradasi Utama */}
              <span className="relative bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent drop-shadow-sm">
                {winner}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tombol Aksi Modern */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={startDraw}
        disabled={participants.length === 0 || isRolling}
        className="relative group px-12 py-5 rounded-full font-bold text-xl tracking-wide text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10 overflow-hidden"
      >
        {/* Background Base */}
        <div className="absolute inset-0 bg-zinc-900 group-hover:bg-zinc-800 transition-colors" />
        
        {/* Border Glow Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 p-[2px] rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
          <div className="w-full h-full bg-zinc-950 rounded-full" />
        </div>
        
        {/* Glow di bawah tombol */}
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/40 to-pink-600/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity z-[-1]" />

        {/* Text */}
        <span className="relative z-10 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300">
          {isRolling ? "Sedang Mengacak..." : "MULAI UNDIAN"}
        </span>
      </motion.button>
    </div>
  )
}