import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Import } from "lucide-react"
import { toast } from "sonner"

export function ImportTextarea({ onImport }) {
  const [text, setText] = useState("")

  const handleImport = () => {
    const lines = text.split("\n").map(line => line.trim()).filter(line => line !== "")
    if (lines.length === 0) {
      toast.error("Teks kosong, tidak ada nama yang diimpor.")
      return
    }
    onImport(lines)
    setText("")
    toast.success(`${lines.length} nama berhasil diimpor.`)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleImport()
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Paste nama di sini, satu nama per baris..."
        className="min-h-[120px] bg-secondary/50 border-white/10 placeholder:text-muted-foreground/60 resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex justify-end">
        <Button onClick={handleImport} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Import className="h-4 w-4" />
          Import (Ctrl+Enter)
        </Button>
      </div>
    </div>
  )
}