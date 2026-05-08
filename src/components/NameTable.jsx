import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function NameTable({ participants, onDelete }) {
  if (participants.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Belum ada peserta. Silakan tambahkan nama.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-white/10">
            <TableHead className="w-[80px]">#</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead className="w-[100px] text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((name, index) => (
            <TableRow key={index} className="border-white/10 group">
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}