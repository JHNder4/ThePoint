import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Zap } from "lucide-react";
import { getBanner, DEFAULT_BANNER } from "../admin/store";
import { BannerSettings } from "../admin/types";

interface HomeScreenProps {
  onStartOrder: () => void;
}

const TAPS_REQUIRED = 5;
const TAP_RESET_MS = 2000;

export function HomeScreen({ onStartOrder }: HomeScreenProps) {
  const [tapCount, setTapCount] = useState(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [banner, setBanner] = useState<BannerSettings>(DEFAULT_BANNER);

  useEffect(() => {
    getBanner().then(setBanner).catch(() => {});
  }, []);

  const handleLogoTap = useCallback(() => {
    setTapCount(prev => {
      const next = prev + 1;
      if (next >= TAPS_REQUIRED) {
        if (resetTimer.current) clearTimeout(resetTimer.current);
        window.location.href = "/admin";
        return 0;
      }
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setTapCount(0), TAP_RESET_MS);
      return next;
    });
  }, []);

  const handleButtonClick = () => {
    if (banner.buttonLink) {
      window.open(banner.buttonLink, "_blank");
    } else {
      onStartOrder();
    }
  };

  const showPromoBanner = banner.isActive && (banner.title || banner.subtitle);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#09090B]"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-sm mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{
            background: "rgba(37, 99, 235, 0.1)",
            border: "1px solid rgba(37, 99, 235, 0.25)",
          }}
        >
          <Zap className="w-3 h-3 text-blue-400" />
          <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">
            {banner.badgeText || "Entrega Premium"}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 80, damping: 18 }}
          className="mb-8 cursor-default select-none"
          onClick={handleLogoTap}
        >
          <h1
            className="font-black tracking-tight leading-none"
            style={{ fontSize: "clamp(3.5rem, 16vw, 5.5rem)", letterSpacing: "-0.03em" }}
          >
            <span className="text-white">The</span>
            <span style={{ color: "#2563EB" }}>point</span>
          </h1>
        </motion.div>

        {/* Banner promocional */}
        <AnimatePresence>
          {showPromoBanner && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="w-full mb-6 rounded-2xl overflow-hidden relative"
              style={{
                background: "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(9,9,11,0.95) 100%)",
                border: "1px solid rgba(37,99,235,0.3)",
              }}
            >
              {banner.imageUrl && (
                <div className="absolute inset-0 opacity-15">
                  <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative p-5 text-left">
                {banner.title && (
                  <p className="text-white font-bold text-base leading-tight">{banner.title}</p>
                )}
                {banner.subtitle && (
                  <p className="text-[#A1A1AA] text-sm mt-1">{banner.subtitle}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, type: "spring", stiffness: 80 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleButtonClick}
          className="w-full relative py-5 px-8 rounded-2xl text-white font-semibold text-lg flex items-center justify-center gap-3 overflow-hidden transition-all duration-300 glow-blue glow-blue-hover"
          style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
        >
          <motion.div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)" }}
          />
          <ShoppingBag className="w-5 h-5 relative z-10 flex-shrink-0" />
          <span className="relative z-10">{banner.buttonText || "Hacer pedido"}</span>
        </motion.button>
      </div>

      <button
        onClick={() => { window.location.href = "/admin"; }}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute bottom-4 right-5 text-[#27272A] hover:text-[#3F3F46] transition-colors duration-300 text-lg leading-none select-none"
        style={{ fontSize: "18px" }}
      >
        •
      </button>
    </motion.div>
  );
}
