import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Plus, Minus, ShoppingCart, Sparkles, Tag } from "lucide-react";

export interface CategoryItem {
  id: string;
  name: string;
  price: number;
}

export interface Promo {
  id: string;
  name: string;
  price: number;
}

interface CategoryScreenProps {
  title: string;
  menuLabel: string;
  items: CategoryItem[];
  promos: Promo[];
  cart: Record<string, number>;
  totalCartItems: number;
  totalCartPrice: number;
  onUpdateCart: (id: string, qty: number) => void;
  onBack: () => void;
  onViewCart: () => void;
}

export function CategoryScreen({
  title,
  menuLabel,
  items,
  promos,
  cart,
  totalCartItems,
  totalCartPrice,
  onUpdateCart,
  onBack,
  onViewCart,
}: CategoryScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="min-h-screen bg-[#09090B] pb-36"
    >
      <div className="px-5 pt-12 pb-4 max-w-lg mx-auto">
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
          transition={{ delay: 0.08 }}
          className="mb-8"
        >
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 text-blue-400"
            style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)" }}
          >
            <Tag className="w-3 h-3" />
            Categoría
          </div>
          <h2
            className="text-white font-black tracking-tight leading-none"
            style={{ fontSize: "clamp(1.6rem, 7vw, 2.2rem)", letterSpacing: "-0.03em" }}
          >
            {title}
          </h2>
          <p className="text-[#52525B] text-xs font-semibold uppercase tracking-widest mt-2">
            {menuLabel}
          </p>
        </motion.div>

        <div className="flex flex-col gap-3 mb-8">
          {items.map((item, index) => {
            const quantity = cart[item.id] || 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.07 }}
                className="rounded-xl p-4 flex items-center justify-between transition-all duration-300"
                style={{
                  background: quantity > 0 ? "rgba(37,99,235,0.08)" : "rgba(24,24,27,0.8)",
                  border: quantity > 0 ? "1px solid rgba(37,99,235,0.3)" : "1px solid rgba(63,63,70,0.5)",
                }}
              >
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-white font-medium text-sm leading-snug">{item.name}</p>
                  <p className="text-blue-400 font-bold text-base mt-0.5">${item.price}</p>
                </div>
                <div
                  className="flex items-center gap-1 rounded-xl p-1 flex-shrink-0"
                  style={{ background: "rgba(39,39,42,0.8)" }}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onUpdateCart(item.id, Math.max(0, quantity - 1))}
                    disabled={quantity === 0}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                    style={{ background: quantity > 0 ? "rgba(63,63,70,0.8)" : "transparent", color: "#FAFAFA" }}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </motion.button>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={quantity}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.12 }}
                      className="w-8 text-center font-bold text-sm text-white tabular-nums"
                    >
                      {quantity}
                    </motion.span>
                  </AnimatePresence>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onUpdateCart(item.id, quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                    style={{
                      background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                      boxShadow: "0 0 8px rgba(37,99,235,0.3)",
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {promos.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(63,63,70,0.6))" }} />
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span className="text-[#71717A] text-xs font-semibold uppercase tracking-widest">Promociones</span>
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </div>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(63,63,70,0.6))" }} />
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              {promos.map((promo, index) => {
                const quantity = cart[promo.id] || 0;
                return (
                  <motion.div
                    key={promo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.1, type: "spring", stiffness: 120 }}
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      background: "linear-gradient(145deg, rgba(24,24,27,0.95) 0%, rgba(15,15,18,0.98) 100%)",
                      border: "1px solid rgba(250,204,21,0.25)",
                      boxShadow: quantity > 0
                        ? "0 0 24px rgba(250,204,21,0.2), inset 0 1px 0 rgba(250,204,21,0.1)"
                        : "0 0 0 rgba(0,0,0,0)",
                    }}
                  >
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 1.2 }}
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: "linear-gradient(135deg, rgba(250,204,21,0.06) 0%, transparent 60%)", pointerEvents: "none" }}
                    />

                    <div className="relative p-4">
                      <div className="mb-2">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full text-yellow-400"
                          style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)" }}
                        >
                          PROMO
                        </span>
                      </div>
                      <p
                        className="font-black text-white leading-tight mb-1"
                        style={{ fontSize: "1rem", letterSpacing: "-0.01em" }}
                      >
                        {promo.name}
                      </p>
                      <p className="text-yellow-400 font-bold text-xl">${promo.price}</p>

                      <div className="mt-4">
                        {quantity > 0 ? (
                          <div
                            className="w-full flex items-center justify-between rounded-xl p-1"
                            style={{ background: "rgba(39,39,42,0.8)" }}
                          >
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => onUpdateCart(promo.id, quantity - 1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                              style={{ background: "rgba(63,63,70,0.8)" }}
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span className="font-bold text-sm text-white tabular-nums">{quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => onUpdateCart(promo.id, quantity + 1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                              style={{ background: "rgba(250,204,21,0.3)", border: "1px solid rgba(250,204,21,0.3)" }}
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onUpdateCart(promo.id, 1)}
                            className="w-full py-2 rounded-xl text-xs font-bold text-black transition-all"
                            style={{
                              background: "linear-gradient(135deg, #FACC15, #EAB308)",
                              boxShadow: "0 0 14px rgba(250,204,21,0.3)",
                            }}
                          >
                            Agregar al carrito
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {totalCartItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4"
            style={{ background: "linear-gradient(to top, #09090B 60%, transparent)" }}
          >
            <div className="max-w-lg mx-auto">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onViewCart}
                className="w-full py-4 px-6 rounded-2xl text-white font-semibold text-base flex items-center justify-between transition-all duration-300 glow-blue"
                style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-blue-600"
                    style={{ background: "rgba(255,255,255,0.95)" }}
                  >
                    {totalCartItems}
                  </div>
                  <span>{totalCartItems === 1 ? "1 producto" : `${totalCartItems} productos`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">${totalCartPrice}</span>
                  <ShoppingCart className="w-4 h-4" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
