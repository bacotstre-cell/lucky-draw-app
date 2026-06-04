import { useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Group, Users } from "lucide-react"
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

// Variants untuk Framer Motion (Efek gelombang/stagger)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1 // Jeda 100ms antar kartu
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
}

export function GroupPage() {
  const [participants] = useLocalStorage(STORAGE_KEYS.PARTICIPANTS, [])
  const [groupCount, setGroupCount] = useLocalStorage(STORAGE_KEYS.GROUP_COUNT, 2)
  const [groups, setGroups] = useLocalStorage(STORAGE_KEYS.GROUP_RESULTS, [])

  // Optimasi memory dengan useCallback
  const handleDivide = useCallback(() => {
    if (participants.length === 0) {
      toast.error("Daftar peserta kosong. Silakan tambahkan di menu Input Nama.")
      return
    }
    const count = parseInt(groupCount, 10)
    if (isNaN(count) || count < 1) {
      toast.error("Jumlah kelompok minimal 1.")
      return
    }
    if (count > participants.length) {
      toast.error("Jumlah kelompok tidak boleh lebih dari jumlah peserta.")
      return
    }

    const shuffled = shuffleArray(participants)
    const newGroups = Array.from({ length: count }, () => [])

    shuffled.forEach((name, index) => {
      newGroups[index % count].push(name)
    })

    setGroups(newGroups)
    toast.success(`Peserta berhasil dibagi menjadi ${count} kelompok.`)
  }, [participants, groupCount, setGroups])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Pengumuman Pembaca Layar */}
      <div aria-live="polite" className="sr-only">
        {groups.length > 0 ? `Telah dibagi menjadi ${groups.length} kelompok.` : ""}
      </div>

      <Card className="border-white/10 bg-card/40 backdrop-blur-xl shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Group className="h-5 w-5 text-emerald-400" />
            Pembagian Kelompok
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-white/5 border border-white/5 w-fit">
            <Users className="h-4 w-4 text-emerald-500" />
            <p className="text-sm font-medium text-slate-300">
              Total peserta aktif: <span className="text-white font-bold">{participants.length}</span> orang
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <label htmlFor="group-count" className="text-sm font-medium text-slate-300">
                Jumlah Kelompok
              </label>
              <Input
                id="group-count"
                type="number"
                min={1}
                max={participants.length || 1}
                value={groupCount}
                onChange={(e) => setGroupCount(e.target.value)}
                className="bg-black/20 border-white/10 w-full sm:w-40 text-lg font-medium focus-visible:ring-emerald-500/50"
              />
            </div>
            <Button
              onClick={handleDivide}
              disabled={participants.length === 0}
              className="gap-2 w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all"
            >
              Acak & Bagi Kelompok
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {groups.length > 0 && (
          <motion.div
            key="group-results"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {groups.map((group, index) => (
              <motion.div key={index} variants={cardVariants}>
                <Card className="h-full border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-transparent backdrop-blur-md shadow-lg hover:border-emerald-500/40 transition-colors duration-300">
                  <CardHeader className="pb-3 border-b border-emerald-500/10 mb-3 bg-emerald-950/20">
                    <CardTitle className="text-lg font-bold text-emerald-400 flex justify-between items-center">
                      Kelompok {index + 1}
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/20">
                        {group.length} Orang
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5">
                      {group.map((name, i) => (
                        <li 
                          key={name} // Menggunakan nama sebagai Key, bukan Index
                          className="flex items-center gap-3 text-sm text-slate-200 group"
                        >
                          <span className="w-5 h-5 rounded-full bg-black/40 border border-white/5 flex items-center justify-center text-[10px] text-emerald-500 font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                            {i + 1}
                          </span>
                          <span className="truncate">{name}</span>
                        </li>
                      ))}
                    </ul>
                    {group.length === 0 && (
                      <p className="text-muted-foreground text-sm italic text-center py-6">
                        Kosong
                      </p>
                    )}
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