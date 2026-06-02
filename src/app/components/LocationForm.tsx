import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, MapPin, Navigation, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

interface LocationFormProps {
  onBack: () => void;
  onContinue: (address: string) => void;
}

type GpsState = "idle" | "loading" | "success" | "error";

export function LocationForm({ onBack, onContinue }: LocationFormProps) {
  const [address, setAddress] = useState("");
  const [gpsState, setGpsState] = useState<GpsState>("idle");
  const [gpsError, setGpsError] = useState("");

  const handleShareLocation = () => {
    if (!("geolocation" in navigator)) {
      setGpsState("error");
      setGpsError("Tu navegador no soporta geolocalización. Escribe tu dirección manualmente.");
      return;
    }

    setGpsState("loading");
    setGpsError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://maps.google.com/?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        setAddress(`📍 Ubicación GPS\n${mapsUrl}`);
        setGpsState("success");
      },
      (error) => {
        setGpsState("error");
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError("No pudimos obtener tu ubicación. Puedes escribir tu dirección manualmente.");
        } else if (error.code === error.TIMEOUT) {
          setGpsError("Intentando obtener ubicación tardó demasiado. Escribe tu dirección manualmente.");
        } else {
          setGpsError("No pudimos obtener tu ubicación. Puedes escribir tu dirección manualmente.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleContinue = () => {
    if (address.trim()) onContinue(address.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="min-h-screen bg-[#09090B] pb-10"
    >
      <div className="px-5 pt-12 pb-6 max-w-lg mx-auto">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 text-[#71717A] hover:text-white transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Volver</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white tracking-tight">Ubicación</h2>
          <p className="text-[#71717A] text-sm mt-1">¿Dónde te enviamos tu pedido?</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mb-5 flex flex-col gap-2"
        >
          <motion.button
            whileHover={{ scale: gpsState === "loading" ? 1 : 1.02, y: gpsState === "loading" ? 0 : -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShareLocation}
            disabled={gpsState === "loading"}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 transition-all duration-300 disabled:cursor-not-allowed"
            style={{
              background: gpsState === "success"
                ? "rgba(34, 197, 94, 0.1)"
                : "rgba(37, 99, 235, 0.1)",
              border: gpsState === "success"
                ? "1px solid rgba(34, 197, 94, 0.35)"
                : "1px solid rgba(37, 99, 235, 0.3)",
              color: gpsState === "success" ? "#86EFAC" : "#93C5FD",
              boxShadow: gpsState === "success"
                ? "0 0 20px rgba(34,197,94,0.08)"
                : "0 0 20px rgba(37,99,235,0.1)",
            }}
          >
            {gpsState === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
            {gpsState === "success" && <CheckCircle2 className="w-4 h-4 text-green-400" />}
            {(gpsState === "idle" || gpsState === "error") && <Navigation className="w-4 h-4" />}
            <span>
              {gpsState === "loading" && "Obteniendo ubicación..."}
              {gpsState === "success" && "Ubicación obtenida correctamente"}
              {gpsState === "idle" && "Compartir mi ubicación"}
              {gpsState === "error" && "Volver a intentar"}
            </span>
          </motion.button>

          <AnimatePresence>
            {gpsState === "error" && gpsError && (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2.5 px-4 py-3 rounded-xl overflow-hidden"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-xs leading-relaxed">{gpsError}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="flex-1 h-px bg-[#27272A]" />
          <span className="text-[#52525B] text-xs font-medium">o escribe tu dirección</span>
          <div className="flex-1 h-px bg-[#27272A]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Calle, número, colonia, referencias..."
            rows={4}
            className="w-full px-4 py-4 rounded-2xl text-white placeholder-[#52525B] resize-none outline-none transition-all duration-300 text-sm"
            style={{
              background: "rgba(24, 24, 27, 0.9)",
              border: address ? "1px solid rgba(37, 99, 235, 0.4)" : "1px solid rgba(63, 63, 70, 0.6)",
              boxShadow: address ? "0 0 16px rgba(37,99,235,0.08)" : "none",
            }}
            onFocus={(e) => {
              e.target.style.border = "1px solid rgba(37, 99, 235, 0.5)";
              e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.border = address ? "1px solid rgba(37,99,235,0.4)" : "1px solid rgba(63,63,70,0.6)";
              e.target.style.boxShadow = address ? "0 0 16px rgba(37,99,235,0.08)" : "none";
            }}
          />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          whileHover={{ scale: address.trim() ? 1.02 : 1, y: address.trim() ? -1 : 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          disabled={!address.trim()}
          className="w-full py-4 px-6 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2.5 transition-all duration-300 glow-blue disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          style={{
            background: address.trim()
              ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
              : "#27272A",
          }}
        >
          <MapPin className="w-4 h-4" />
          <span>Confirmar pedido</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
