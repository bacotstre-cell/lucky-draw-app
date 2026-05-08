import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, History, Trash2, Sparkles } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/utils/storage";
import { toast } from "sonner";
import ConfettiBoom from "react-confetti-boom";

export function DrawPage() {
  const [participants] = useLocalStorage(STORAGE_KEYS.PARTICIPANTS, []);
  const [winners, setWinners] = useLocalStorage(STORAGE_KEYS.WINNERS, []);
  const [isDrawing, setIsDrawing] = useState(false);
  const [displayedName, setDisplayedName] = useState("Siap Diundi?");
  const [showConfetti, setShowConfetti] = useState(false);
  const intervalRef = useRef(null);

  const availableParticipants = participants.filter(
    (p) => !winners.some((w) => w.name === p)
  );

  const startDraw = () => {
    if (availableParticipants.length === 0) {
      toast.error("Tidak ada peserta tersisa untuk diundi!");
      return;
    }

    setIsDrawing(true);
    setShowConfetti(false);

    let counter = 0;
    const duration = 3000;
    const speed = 50;

    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      setDisplayedName(availableParticipants[randomIndex]);
      counter += speed;

      if (counter >= duration) {
        clearInterval(intervalRef.current);
        finishDraw();
      }
    }, speed);
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
        hour: '2-digit', minute:'2-digit' 
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
    // Membuang background hitam, menggunakan w-full agar melebur dengan layout parent
    <div className="w-full flex flex-col relative animate-in fade-in duration-700">
      
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <ConfettiBoom mode="boom" particleCount={250} colors={['#a855f7', '#ec4899', '#3b82f6', '#facc15']} />
        </div>
      )}

      {/* Grid Layout ala Bento Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Kolom Kiri: Panggung Utama (Makan 2 kolom di layar besar) */}
        <Card className="lg:col-span-2 relative overflow-hidden border-muted/50 bg-card/50 backdrop-blur-xl shadow-sm rounded-3xl min-h-[450px] flex flex-col items-center justify-center p-8 group">
          {/* Efek Glow Halus di Background yang menyesuaikan light/dark mode */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-110"></div>
          
          <div className="z-10 flex flex-col items-center space-y-12 w-full">
            <div className="flex items-center gap-2 text-muted-foreground mb-2 font-medium tracking-widest uppercase text-xs">
              <Trophy className="h-4 w-4 text-amber-500" />
              Panggung Undian
            </div>

            {/* Teks Nama */}
            <div className="h-32 flex items-center justify-center w-full">
              <h1 
                className={`text-5xl md:text-7xl font-black text-center px-4 transition-all duration-200 ${
                  isDrawing ? 'scale-105 opacity-70 blur-[2px]' : 'scale-100 opacity-100'
                }`}
                style={{
                  background: "linear-gradient(135deg, #a855f7, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {displayedName}
              </h1>
            </div>

            {/* Tombol Acak Modern */}
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
          <Card className="border-muted/50 bg-card/50 backdrop-blur-xl shadow-sm rounded-3xl flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                <Users className="h-4 w-4 text-purple-500" />
                Peserta Aktif ({availableParticipants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-2 scrollbar-thin">
                {availableParticipants.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Daftar peserta kosong.</p>
                ) : (
                  availableParticipants.map((name, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 bg-secondary hover:bg-secondary/80 transition-colors rounded-lg text-xs font-medium text-secondary-foreground"
                    >
                      {name}
                    </span>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Panel Riwayat */}
          <Card className="border-muted/50 bg-card/50 backdrop-blur-xl shadow-sm rounded-3xl flex-1 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                <History className="h-4 w-4 text-pink-500" />
                Riwayat Pemenang
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearHistory}
                disabled={winners.length === 0}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                title="Hapus Riwayat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1">
              {winners.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic py-8">
                  Belum ada pemenang.
                </div>
              ) : (
                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 scrollbar-thin">
                  {winners.map((winner, idx) => (
                    <div 
                      key={idx} 
                      className="flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold">
                          {winners.length - idx}
                        </span>
                        <span className="text-sm font-medium text-foreground">{winner.name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {winner.date.split(',')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Footer Powered By */}
      <div className="flex justify-center items-center py-4">
        <p className="text-xs text-muted-foreground font-medium">
          Powered by <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Firman</span>
        </p>
      </div>

    </div>
  );
}