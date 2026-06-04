import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function NameTable({ participants, onDelete }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-lg overflow-hidden">
      <Table>
        <TableHeader>
          {/* Header dibuat lebih gelap dengan teks yang jelas */}
          <TableRow className="hover:bg-transparent border-white/10 bg-black/40">
            <TableHead className="w-[80px] text-zinc-400 font-semibold">No</TableHead>
            <TableHead className="text-zinc-400 font-semibold">Nama Peserta</TableHead>
            <TableHead className="w-[100px] text-right text-zinc-400 font-semibold">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="popLayout">
            {participants.length === 0 ? (
              // Empty State saat tabel kosong
              <motion.tr
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-transparent"
              >
                <TableCell colSpan={3} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <Users className="h-6 w-6 text-zinc-500" />
                    </div>
                    <p className="text-sm font-medium">Belum ada peserta</p>
                    <p className="text-xs text-zinc-500">Silakan tambahkan nama peserta terlebih dahulu.</p>
                  </div>
                </TableCell>
              </motion.tr>
            ) : (
              // Data baris tabel
              participants.map((name, index) => (
                <motion.tr
                  key={name}
                  layout
                  initial={{ opacity: 0, x: -20, backgroundColor: "rgba(168, 85, 247, 0.2)" }}
                  animate={{ opacity: 1, x: 0, backgroundColor: "rgba(0,0,0,0)" }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                  // Paksa background transparan, dan beri sedikit highlight saat di-hover
                  className="border-white/5 group bg-transparent hover:bg-white/5 transition-colors duration-200"
                >
                  <TableCell className="font-medium text-zinc-500">{index + 1}</TableCell>
                  {/* Teks nama berwarna putih / slate terang */}
                  <TableCell className="font-medium text-slate-100 tracking-wide">{name}</TableCell>
                  <TableCell className="text-right">
                    {/* Tombol Hapus */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(index)}
                      aria-label={`Hapus peserta ${name}`}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  )
}