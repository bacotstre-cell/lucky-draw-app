import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function HistoryList({ winners, onClear }) {
  if (winners.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6">
        Belum ada pemenang.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Riwayat Pemenang</h3>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-red-400">
          <Trash2 className="h-4 w-4 mr-1" /> Hapus Riwayat
        </Button>
      </div>
      <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2">
        {winners.slice().reverse().map((winner, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center p-3 bg-card/60 backdrop-blur-sm rounded-lg border border-white/5"
          >
            <span className="font-medium text-purple-300">{winner.name}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(winner.timestamp).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}