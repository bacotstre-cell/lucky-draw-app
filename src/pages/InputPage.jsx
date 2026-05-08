import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { NameTable } from "@/components/NameTable"
import { ImportTextarea } from "@/components/ImportTextarea"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { STORAGE_KEYS } from "@/utils/storage"
import { toast } from "sonner"

export function InputPage() {
  const [participants, setParticipants] = useLocalStorage(STORAGE_KEYS.PARTICIPANTS, [])
  const [newName, setNewName] = useState("")
  const [resetDialogOpen, setResetDialogOpen] = useState(false)

  const addParticipant = useCallback((name) => {
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error("Nama tidak boleh kosong.")
      return
    }
    if (participants.some(p => p.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Nama sudah ada, duplikat tidak diizinkan.")
      return
    }
    setParticipants(prev => [...prev, trimmed])
    toast.success(`${trimmed} ditambahkan.`)
  }, [participants, setParticipants])

  const handleAddSingle = () => {
    addParticipant(newName)
    setNewName("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSingle()
    }
  }

  const handleImport = (names) => {
    const uniqueNew = names.filter(name => !participants.some(p => p.toLowerCase() === name.toLowerCase()))
    if (uniqueNew.length === 0) {
      toast.error("Semua nama sudah ada dalam daftar.")
      return
    }
    setParticipants(prev => [...prev, ...uniqueNew])
  }

  const deleteParticipant = (index) => {
    setParticipants(prev => prev.filter((_, i) => i !== index))
    toast.success("Peserta dihapus.")
  }

  const resetAll = () => {
    setParticipants([])
    toast.success("Semua peserta dihapus.")
  }

  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-card/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-purple-400" />
            Tambah Peserta Manual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Ketik nama peserta..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-secondary/50 border-white/10"
            />
            <Button onClick={handleAddSingle} className="shrink-0 gap-2 bg-primary hover:bg-primary/90">
              <UserPlus className="h-4 w-4" /> Tambah
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-card/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Import Massal (Paste dari Clipboard)</CardTitle>
        </CardHeader>
        <CardContent>
          <ImportTextarea onImport={handleImport} />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-card/40 backdrop-blur-sm">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Daftar Peserta ({participants.length})</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setResetDialogOpen(true)}
            disabled={participants.length === 0}
            className="text-red-400 hover:text-red-300"
          >
            Reset Semua
          </Button>
        </CardHeader>
        <CardContent>
          <NameTable participants={participants} onDelete={deleteParticipant} />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="Reset Semua Peserta"
        description="Anda yakin ingin menghapus seluruh daftar peserta? Tindakan ini tidak dapat dibatalkan."
        onConfirm={resetAll}
      />
    </div>
  )
}