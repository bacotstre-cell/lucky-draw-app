import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function DrawAnimation({ participants, onComplete }) {
  const [currentName, setCurrentName] = useState("")
  const [isRolling, setIsRolling] = useState(false)
  const intervalRef = useRef(null)

  const startDraw = () => {
    if (participants.length === 0) return
    setIsRolling(true)
    let counter = 0
    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * participants.length)
      setCurrentName(participants[randomIndex])
      counter++
      if (counter > 30) { // sekitar 3 detik (30 iterasi * 100ms)
        clearInterval(intervalRef.current)
        const winner = participants[Math.floor(Math.random() * participants.length)]
        setCurrentName(winner)
        setIsRolling(false)
        onComplete(winner)
      }
    }, 80)
  }

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [participants])

  return (
    <div className="flex flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        {currentName ? (
          <motion.div
            key={currentName + isRolling}
            initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              filter: "blur(0px)",
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            exit={{ scale: 1.2, opacity: 0, filter: "blur(15px)" }}
            className="text-6xl md:text-8xl font-black text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]"
          >
            {currentName}
          </motion.div>
        ) : (
          <div className="text-6xl md:text-8xl font-black text-center text-muted-foreground/30">
            ???
          </div>
        )}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={startDraw}
        disabled={participants.length === 0 || isRolling}
        className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xl font-bold shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:shadow-[0_0_40px_rgba(168,85,247,0.9)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRolling ? "Mengacak..." : "ACAK!"}
      </motion.button>
    </div>
  )
}