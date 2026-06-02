import { motion } from "motion/react";
import { CheckCircle2, MessageCircle, Home, MapPin, CreditCard } from "lucide-react";
import { useState } from "react";
import { AllItems } from "./Cart";

interface OrderConfirmationProps {
  allItems: AllItems;
  cart: Record<string, number>;
  address: string;
  onSendWhatsApp: () => void;
  onBackToHome: () => void;
}

export function OrderConfirmation({
  allItems,
  cart,
  address,
  onSendWhatsApp,
  onBackToHome,
}: OrderConfirmationProps) {
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (sent) return;
    setSent(true);
    onSendWhatsApp();
  };

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, quantity]) => ({
      id,
      quantity,
      name: allItems[id]?.name ?? id,
      price: allItems[id]?.price ?? 0,
    }));

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="min-h-screen bg-[#09090B] flex flex-col items-center justify-start px-5 pt-16 pb-10"
    >
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 16 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(37, 99, 235, 0.12)",
                border: "1px solid rgba(37, 99, 235, 0.3)",
                boxShadow: "0 0 40px rgba(37, 99, 235, 0.25)",
              }}
            >
              <CheckCircle2 className="w-10 h-10 text-blue-400" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full"
              style={{ background: "rgba(37, 99, 235, 0.15)" }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">¡Pedido listo!</h2>
          <p className="text-[#71717A] text-sm">Confirma enviándolo por WhatsApp</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className="rounded-2xl overflow-hidden mb-4"
          style={{
            background: "rgba(24, 24, 27, 0.85)",
            border: "1px solid rgba(63, 63, 70, 0.5)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          }}
        >
          <div className="px-5 pt-5 pb-3">
            <p className="text-[#71717A] text-xs font-semibold uppercase tracking-wider mb-3">Resumen</p>
            <div className="flex flex-col gap-2.5 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-blue-400 flex-shrink-0"
                      style={{ background: "rgba(37,99,235,0.12)" }}
                    >
                      {item.quantity}
                    </div>
                    <span className="text-[#D4D4D8] text-sm truncate">{item.name}</span>
                  </div>
                  <span className="text-white font-semibold text-sm flex-shrink-0 ml-3">${item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ background: "rgba(37, 99, 235, 0.06)", borderTop: "1px solid rgba(37,99,235,0.15)" }}
          >
            <span className="text-[#A1A1AA] font-semibold text-sm">Total</span>
            <span className="text-blue-400 font-black text-xl tracking-tight">${total} MXN</span>
          </div>

          <div className="px-5 py-4 space-y-3 border-t border-[#27272A]">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#52525B] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[#71717A] text-xs mb-0.5">Dirección de entrega</p>
                <p className="text-[#D4D4D8] text-sm leading-snug">{address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-[#52525B] flex-shrink-0" />
              <div>
                <p className="text-[#71717A] text-xs mb-0.5">Método de pago</p>
                <p className="text-[#D4D4D8] text-sm">Efectivo</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.46 }}
          className="flex flex-col gap-3"
        >
          <div className="relative">
            {!sent && (
              <motion.div
                animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-2xl"
                style={{ background: "rgba(37, 211, 102, 0.2)", filter: "blur(10px)" }}
              />
            )}
            <motion.button
              whileHover={{ scale: sent ? 1 : 1.02, y: sent ? 0 : -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSend}
              disabled={sent}
              className="relative w-full py-4 px-6 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2.5 transition-all duration-300 disabled:cursor-not-allowed"
              style={{
                background: sent
                  ? "rgba(39, 39, 42, 0.8)"
                  : "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                boxShadow: sent
                  ? "none"
                  : "0 0 28px rgba(34, 197, 94, 0.35), 0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <MessageCircle className="w-5 h-5 flex-shrink-0" />
              <span>{sent ? "Pedido enviado ✓" : "Enviar pedido por WhatsApp"}</span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBackToHome}
            className="w-full py-4 px-6 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: "rgba(24, 24, 27, 0.8)",
              border: "1px solid rgba(63, 63, 70, 0.5)",
              color: "#A1A1AA",
            }}
          >
            <Home className="w-4 h-4" />
            <span>Volver al inicio</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
