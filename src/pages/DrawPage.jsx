import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, History, Trash2, Sparkles } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/utils/storage";
import { toast } from "sonner";
import ConfettiBoom from "react-confetti-boom";
import { motion, AnimatePresence } from "framer-motion";

export function DrawPage() {
  const [participants] = useLocalStorage(STORAGE_KEYS.PARTICIPANTS, []);
  const [winners, setWinners] = useLocalStorage(STORAGE_KEYS.WINNERS, []);
  const [isDrawing, setIsDrawing] = useState(false);
  const [displayedName, setDisplayedName] = useState("Siap Diundi?");
  const [showConfetti, setShowConfetti] = useState(false);
  const intervalRef = useRef(null);

  // Memoize daftar peserta aktif agar tidak dihitung ulang berkali-kali
  const availableParticipants = useMemo(() => {
    return participants.filter((p) => !winners.some((w) => w.name === p));
  }, [participants, winners]);

  const startDraw = () => {
    if (availableParticipants.length === 0) {
      toast.error("Tidak ada peserta tersisa untuk diundi!");
      return;
    }

    setIsDrawing(true);
    setShowConfetti(false);

    let counter = 0;
    const durationTicks = 40; // ~2.4 detik

    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      setDisplayedName(availableParticipants[randomIndex]);
      counter++;

      if (counter >= durationTicks) {
        clearInterval(intervalRef.current);
        finishDraw();
      }
    }, 60);
  };

  const finishDraw = () => {
    const winningIndex = Math.floor(Math.random() * availableParticipants.length);
    const winnerName = availableParticipants[winningIndex];

    setDisplayedName(winnerName);
    setIsDrawing(false);
    setShowConfetti(true);

    const newWinner = {
      name: winnerName,
      date: new Date().toLocaleString('id-ID', { 
        year: '2-digit', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute:'2-digit', second: '2-digit'
      })
    };
    
    setWinners((prev) => [newWinner, ...prev]);
    toast.success(`Selamat kepada ${winnerName}!`);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const clearHistory = () => {
    if (confirm("Yakin ingin menghapus semua riwayat pemenang?")) {
      setWinners([]);
      setDisplayedName("Siap Diundi?");
      setShowConfetti(false);
      toast.success("Riwayat dihapus.");
    }
  };

  return (
    <div className="w-full flex flex-col relative animate-in fade-in duration-700">
      
      {/* Pengumuman Pembaca Layar Tersembunyi */}
      <div aria-live="assertive" className="sr-only">
        {!isDrawing && showConfetti ? `Pemenangnya adalah ${displayedName}` : ""}
      </div>

      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <ConfettiBoom mode="boom" particleCount={250} colors={['#a855f7', '#ec4899', '#3b82f6', '#facc15']} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Kolom Kiri: Panggung Utama */}
        <Card className="lg:col-span-2 relative overflow-hidden border-muted/50 bg-card/50 backdrop-blur-xl shadow-sm rounded-3xl min-h-[450px] flex flex-col items-center justify-center p-8 group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-110"></div>
          
          <div className="z-10 flex flex-col items-center space-y-12 w-full">
            <div className="flex items-center gap-2 text-muted-foreground mb-2 font-medium tracking-widest uppercase text-xs">
              <Trophy className="h-4 w-4 text-amber-500" />
              Panggung Undian
            </div>

            {/* Area Teks Nama dengan AnimatePresence */}
            <div className="h-32 flex items-center justify-center w-full relative" aria-hidden="true">
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={isDrawing ? "drawing" : displayedName}
                  initial={!isDrawing && showConfetti ? { scale: 0.5, opacity: 0, y: 20 } : false}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    filter: isDrawing ? "blur(2px)" : "blur(0px)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`text-5xl md:text-7xl font-black text-center px-4 ${isDrawing ? 'text-muted-foreground' : ''}`}
                  style={!isDrawing ? {
                    background: "linear-gradient(135deg, #a855f7, #ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  } : {}}
                >
                  {displayedName}
                </motion.h1>
              </AnimatePresence>
            </div>

            <Button 
              onClick={startDraw} 
              disabled={isDrawing || availableParticipants.length === 0}
              className="relative h-16 px-12 rounded-full bg-foreground hover:bg-foreground/90 text-background text-lg font-bold shadow-[0_0_40px_-10px_rgba(168,85,247,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(236,72,153,0.5)] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              <span className="flex items-center gap-2">
                {isDrawing ? "Mengacak Nama..." : "Mulai Undian"}
                {!isDrawing && <Sparkles className="h-5 w-5" />}
              </span>
            </Button>
          </div>
        </Card>

        {/* Kolom Kanan: Stack Peserta & Riwayat */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          {/* Panel Peserta */}
          <Card className="border-muted/50 bg-card/50 backdrop-blur-xl shadow-sm rounded-3xl flex-1 flex flex-col max-h-[220px]">
            <CardHeader className="pb-3 border-b border-muted/20">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                <Users className="h-4 w-4 text-purple-500" />
                Peserta Aktif ({availableParticipants.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 flex-1 overflow-hidden">
              <div className="flex flex-wrap gap-2 h-full overflow-y-auto pr-2 custom-scrollbar">
                {availableParticipants.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Kosong / Semua sudah menang.</p>
                ) : (
                  <AnimatePresence>
                    {availableParticipants.map((name) => (
                      <motion.span 
                        key={name} // Key berbasis value, BUKAN index
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="px-3 py-1 bg-secondary hover:bg-secondary/80 transition-colors rounded-lg text-xs font-medium text-secondary-foreground"
                      >
                        {name}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Panel Riwayat */}
          <Card className="border-muted/50 bg-card/50 backdrop-blur-xl shadow-sm rounded-3xl flex-1 flex flex-col max-h-[300px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-muted/20">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                <History className="h-4 w-4 text-pink-500" />
                Riwayat
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearHistory}
                disabled={winners.length === 0}
                aria-label="Hapus semua riwayat"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-3 flex-1 overflow-hidden">
              {winners.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic py-8">
                  Belum ada pemenang.
                </div>
              ) : (
                <ul className="space-y-2 h-full overflow-y-auto pr-2 custom-scrollbar" role="list">
                  <AnimatePresence initial={false}>
                    {winners.map((winner, idx) => (
                      <motion.li 
                        key={`${winner.name}-${winner.date}`} // Key unik komposit
                        layout
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="flex justify-between items-center p-2 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold">
                            {winners.length - idx}
                          </span>
                          <span className="text-sm font-medium text-foreground truncate">{winner.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground ml-2 shrink-0">
                          {winner.date.split(', ')[1]}
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Footer Powered By */}
      <div className="flex justify-center items-center py-4 border-t border-muted/20">
        <p className="text-xs text-muted-foreground font-medium tracking-wide">
          Powered by <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Firman</span>
        </p>
      </div>

    </div>
  );
}