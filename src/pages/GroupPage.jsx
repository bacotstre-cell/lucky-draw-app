import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Group } from "lucide-react"
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

export function GroupPage() {
  const [participants] = useLocalStorage(STORAGE_KEYS.PARTICIPANTS, [])
  const [groupCount, setGroupCount] = useState(2)
  const [groups, setGroups] = useState([])

  const handleDivide = () => {
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

    // Acak seluruh peserta
    const shuffled = shuffleArray(participants)
    // Siapkan array kelompok kosong
    const newGroups = Array.from({ length: count }, () => [])

    // Distribusikan peserta secara merata, sisanya ke beberapa grup pertama
    shuffled.forEach((name, index) => {
      newGroups[index % count].push(name)
    })

    setGroups(newGroups)
    toast.success(`Peserta dibagi menjadi ${count} kelompok.`)
  }

  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-card/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Group className="h-6 w-6 text-emerald-400" />
            Pembagian Kelompok
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Total peserta: {participants.length} orang
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1 block">
                Jumlah Kelompok
              </label>
              <Input
                type="number"
                min={1}
                max={participants.length || 1}
                value={groupCount}
                onChange={(e) => setGroupCount(e.target.value)}
                className="bg-secondary/50 border-white/10 w-full sm:w-32"
              />
            </div>
            <Button
              onClick={handleDivide}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {groups.map((group, index) => (
              <Card
                key={index}
                className="border-white/10 bg-card/40 backdrop-blur-sm"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-emerald-400">
                    Kelompok {index + 1}
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({group.length} peserta)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 list-disc list-inside">
                    {group.map((name, i) => (
                      <li key={i}>{name}</li>
                    ))}
                  </ul>
                  {group.length === 0 && (
                    <p className="text-muted-foreground text-sm">Kosong</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}