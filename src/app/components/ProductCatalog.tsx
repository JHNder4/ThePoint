import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, ShoppingCart, ChevronRight, Package2 } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  type?: "product" | "category";
  categoryKey?: string;
  itemCount?: number;
}

interface QuantityControlsProps {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
  accent?: "blue" | "green";
}

function QuantityControls({ quantity, onDecrement, onIncrement, accent = "blue" }: QuantityControlsProps) {
  const accentBg = accent === "blue"
    ? "linear-gradient(135deg, #2563EB, #1D4ED8)"
    : "linear-gradient(135deg, #16A34A, #15803D)";
  const accentShadow = accent === "blue"
    ? "0 0 10px rgba(37,99,235,0.35)"
    : "0 0 10px rgba(22,163,74,0.35)";

  return (
    <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "rgba(39,39,42,0.9)" }}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.82 }}
        onClick={onDecrement}
        disabled={quantity === 0}
        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30"
        style={{
          background: quantity > 0 ? "rgba(63,63,70,0.9)" : "transparent",
          color: quantity > 0 ? "#FAFAFA" : "#52525B",
        }}
      >
        <Minus className="w-4 h-4" />
      </motion.button>

      <AnimatePresence mode="wait">
        <motion.span
          key={quantity}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.14 }}
          className="w-9 text-center font-bold text-base text-white tabular-nums select-none"
        >
          {quantity}
        </motion.span>
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.82 }}
        onClick={onIncrement}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all duration-200"
        style={{ background: accentBg, boxShadow: accentShadow }}
      >
        <Plus className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

interface CardProps {
  product: Product;
  quantity: number;
  onUpdateCart: (id: string, qty: number) => void;
  index: number;
}

function SodaCard({ product, quantity, onUpdateCart, index }: CardProps) {
  const isInCart = quantity > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(18,18,22,0.95)",
        border: isInCart ? "1px solid rgba(37,99,235,0.45)" : "1px solid rgba(63,63,70,0.4)",
        boxShadow: isInCart
          ? "0 0 30px rgba(37,99,235,0.14), 0 8px 32px rgba(0,0,0,0.5)"
          : "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {product.image && (
        <div className="relative w-full overflow-hidden bg-[#111115]" style={{ height: 200 }}>
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.5 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(18,18,22,1) 0%, rgba(18,18,22,0.2) 50%, transparent 100%)" }}
          />
          {isInCart && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "#2563EB", boxShadow: "0 0 14px rgba(37,99,235,0.7)" }}
            >
              {quantity}
            </motion.div>
          )}
        </div>
      )}

      <div className="px-5 pb-5 -mt-2">
        <div className="mb-4">
          <h3
            className="text-white font-black leading-none tracking-tight"
            style={{ fontSize: "2.4rem", letterSpacing: "-0.04em" }}
          >
            {product.name.toUpperCase()}
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-blue-400 font-black text-2xl" style={{ letterSpacing: "-0.03em" }}>
              ${product.price}
            </span>
            <span className="text-[#52525B] text-sm font-medium">1 pz</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <QuantityControls
            quantity={quantity}
            onDecrement={() => onUpdateCart(product.id, Math.max(0, quantity - 1))}
            onIncrement={() => onUpdateCart(product.id, quantity + 1)}
          />
          {isInCart && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-right">
              <p className="text-[#52525B] text-xs">Subtotal</p>
              <p className="text-white font-bold text-sm">${product.price * quantity}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function FrioCard({ product, quantity, onUpdateCart, index }: CardProps) {
  const isInCart = quantity > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(10,12,20,0.97)",
        backdropFilter: "blur(20px)",
        border: isInCart ? "1px solid rgba(99,179,237,0.4)" : "1px solid rgba(99,179,237,0.12)",
        boxShadow: isInCart
          ? "0 0 28px rgba(99,179,237,0.12), 0 8px 32px rgba(0,0,0,0.6)"
          : "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {product.image && (
        <div className="relative w-full overflow-hidden" style={{ height: 210, background: "rgba(8,10,18,0.9)" }}>
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover opacity-80"
            whileHover={{ scale: 1.04, opacity: 0.9 }}
            transition={{ duration: 0.5 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,12,20,1) 0%, rgba(10,12,20,0.3) 50%, transparent 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(99,179,237,0.04) 0%, transparent 60%)" }}
          />
          {isInCart && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "rgba(99,179,237,0.2)",
                border: "1px solid rgba(99,179,237,0.5)",
                color: "#93C5FD",
                backdropFilter: "blur(8px)",
              }}
            >
              {quantity}
            </motion.div>
          )}
        </div>
      )}

      <div className="px-5 pb-5 -mt-1">
        <div className="mb-4">
          <h3
            className="font-black leading-none tracking-tight"
            style={{ fontSize: "2.6rem", letterSpacing: "-0.05em", color: "#E2E8F0" }}
          >
            {product.name.toUpperCase()}
          </h3>
          <p className="font-bold text-base mt-0.5" style={{ color: "rgba(147,197,253,0.9)", letterSpacing: "0.01em" }}>
            ${product.price} / 1 PZ
          </p>
          <p
            className="text-xs font-semibold mt-1 uppercase tracking-widest"
            style={{ color: "rgba(148,163,184,0.5)" }}
          >
            Listo para disfrutar
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "rgba(15,18,30,0.9)" }}>
            <motion.button
              whileTap={{ scale: 0.82 }}
              onClick={() => onUpdateCart(product.id, Math.max(0, quantity - 1))}
              disabled={quantity === 0}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30"
              style={{ background: quantity > 0 ? "rgba(51,65,85,0.9)" : "transparent", color: "#CBD5E1" }}
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <AnimatePresence mode="wait">
              <motion.span
                key={quantity}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.14 }}
                className="w-9 text-center font-bold text-base tabular-nums select-none"
                style={{ color: "#E2E8F0" }}
              >
                {quantity}
              </motion.span>
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.82 }}
              onClick={() => onUpdateCart(product.id, quantity + 1)}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(99,179,237,0.25), rgba(59,130,246,0.2))",
                border: "1px solid rgba(99,179,237,0.3)",
                color: "#93C5FD",
              }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
          {isInCart && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-right">
              <p className="text-[#475569] text-xs">Subtotal</p>
              <p className="font-bold text-sm" style={{ color: "#CBD5E1" }}>${product.price * quantity}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function VerdeCard({ product, quantity, onUpdateCart, index }: CardProps) {
  const isInCart = quantity > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        minHeight: 340,
        border: isInCart ? "1px solid rgba(74,222,128,0.35)" : "1px solid rgba(63,63,70,0.3)",
        boxShadow: isInCart
          ? "0 0 32px rgba(74,222,128,0.1), 0 12px 40px rgba(0,0,0,0.7)"
          : "0 12px 40px rgba(0,0,0,0.6)",
      }}
    >
      {product.image && (
        <motion.img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.7 }}
          style={{ opacity: 0.45 }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, rgba(5,15,5,0.75) 0%, rgba(5,12,8,0.65) 40%, rgba(2,8,4,0.9) 80%, rgba(2,5,3,1) 100%)",
        }}
      />

      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(74,222,128,0.05) 0%, transparent 50%)" }} />

      <div className="absolute top-4 right-4 w-24 h-24 opacity-70">
        <svg width="96" height="96" viewBox="0 0 96 96">
          <defs>
            <path id="stamp-circle-verde" d="M 48 48 m -38 0 a 38 38 0 1 1 76 0 a 38 38 0 1 1 -76 0" />
          </defs>
          <motion.text
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "48px 48px" }}
            fontSize="6.5"
            fill="rgba(134,239,172,0.55)"
            letterSpacing="2.2"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            <textPath href="#stamp-circle-verde">CALIDAD GARANTIZADA • 100% ORGÁNICO •</textPath>
          </motion.text>
          <circle cx="48" cy="48" r="22" fill="none" stroke="rgba(134,239,172,0.15)" strokeWidth="0.8" />
          <circle cx="48" cy="48" r="36" fill="none" stroke="rgba(134,239,172,0.1)" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 p-5 flex flex-col" style={{ minHeight: 340 }}>
        <div className="flex-1">
          <div className="mb-1">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "rgba(134,239,172,0.6)" }}
            >
              Cepa Premium
            </span>
          </div>

          <h3
            className="font-black leading-none tracking-tighter"
            style={{
              fontSize: "clamp(3.5rem, 14vw, 5rem)",
              letterSpacing: "-0.05em",
              color: "rgba(240,255,244,0.95)",
              textShadow: "0 0 40px rgba(74,222,128,0.2)",
            }}
          >
            {product.name.toUpperCase()}
          </h3>

          <div className="mt-3 flex items-baseline gap-2">
            <span
              className="font-black"
              style={{ fontSize: "3rem", letterSpacing: "-0.04em", color: "rgba(134,239,172,0.9)" }}
            >
              {product.price}
            </span>
            <span style={{ color: "rgba(134,239,172,0.5)", fontSize: "1rem", fontWeight: 600 }}>/ 3.5g</span>
          </div>

          <p
            className="mt-1 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "rgba(134,239,172,0.4)" }}
          >
            Cosecha 2026
          </p>

          {isInCart && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.2)" }}
            >
              <span className="text-xs font-bold" style={{ color: "rgba(134,239,172,0.9)" }}>
                {quantity} en carrito · ${product.price * quantity}
              </span>
            </motion.div>
          )}
        </div>

        <div className="mt-auto">
          <div className="w-full h-px mb-4" style={{ background: "linear-gradient(to right, rgba(134,239,172,0.15), transparent)" }} />
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold" style={{ color: "rgba(134,239,172,0.7)" }}>${product.price} / 3.5</p>
            <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "rgba(5,15,8,0.8)", border: "1px solid rgba(134,239,172,0.1)" }}>
              <motion.button
                whileTap={{ scale: 0.82 }}
                onClick={() => onUpdateCart(product.id, Math.max(0, quantity - 1))}
                disabled={quantity === 0}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30"
                style={{ background: quantity > 0 ? "rgba(30,50,35,0.9)" : "transparent", color: "#86EFAC" }}
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <AnimatePresence mode="wait">
                <motion.span
                  key={quantity}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.14 }}
                  className="w-9 text-center font-bold text-base tabular-nums select-none"
                  style={{ color: "#86EFAC" }}
                >
                  {quantity}
                </motion.span>
              </AnimatePresence>
              <motion.button
                whileTap={{ scale: 0.82 }}
                onClick={() => onUpdateCart(product.id, quantity + 1)}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(21,128,61,0.2))",
                  border: "1px solid rgba(134,239,172,0.25)",
                  color: "#86EFAC",
                }}
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DefaultCard({ product, quantity, onUpdateCart, index }: CardProps) {
  const isInCart = quantity > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(24,24,27,0.8)",
        border: isInCart ? "1px solid rgba(37,99,235,0.4)" : "1px solid rgba(63,63,70,0.5)",
        boxShadow: isInCart
          ? "0 0 20px rgba(37,99,235,0.12), 0 4px 20px rgba(0,0,0,0.4)"
          : "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {product.image && (
        <div className="relative w-full h-44 overflow-hidden bg-[#18181B]">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(9,9,11,0.6) 0%, transparent 50%)" }} />
          {isInCart && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "#2563EB", boxShadow: "0 0 12px rgba(37,99,235,0.6)" }}
            >
              {quantity}
            </motion.div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold text-base mb-0.5">{product.name}</h3>
            <p className="text-[#71717A] text-xs">Entrega inmediata</p>
          </div>
          <div className="text-right">
            <span className="text-blue-400 font-bold text-xl">${product.price}</span>
            <p className="text-[#52525B] text-xs">MXN</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <QuantityControls
            quantity={quantity}
            onDecrement={() => onUpdateCart(product.id, Math.max(0, quantity - 1))}
            onIncrement={() => onUpdateCart(product.id, quantity + 1)}
          />
          {isInCart && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-right">
              <p className="text-[#A1A1AA] text-xs">Subtotal</p>
              <p className="text-white font-semibold text-sm">${product.price * quantity}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface ProductCatalogProps {
  products: Product[];
  promoProducts?: Product[];
  cart: Record<string, number>;
  totalCartPrice: number;
  onUpdateCart: (productId: string, quantity: number) => void;
  onContinue: () => void;
  onOpenCategory: (categoryKey: string) => void;
}

export function ProductCatalog({ products, promoProducts = [], cart, totalCartPrice, onUpdateCart, onContinue, onOpenCategory }: ProductCatalogProps) {
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="min-h-screen bg-[#09090B] pb-36"
    >
      <div
        className="sticky top-0 z-20 px-5 pt-12 pb-5"
        style={{ background: "linear-gradient(to bottom, #09090B 65%, transparent)" }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Menú</h2>
            <p className="text-[#71717A] text-sm mt-0.5">
              {products.filter(p => p.type !== "category").length} productos · {products.filter(p => p.type === "category").length} categorías
              {promoProducts.length > 0 && ` · ${promoProducts.length} promos`}
            </p>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-blue-400"
            style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)" }}
          >
            Thepoint
          </div>
        </div>
      </div>

      <div className="px-5 max-w-lg mx-auto">
        <div className="flex flex-col gap-4">
          {products.map((product, index) => {
            if (product.type === "category") {
              return (
                <motion.button
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07, duration: 0.4 }}
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => product.categoryKey && onOpenCategory(product.categoryKey)}
                  className="relative w-full rounded-2xl overflow-hidden text-left"
                  style={{
                    background: "linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(15,15,18,0.95) 70%)",
                    border: "1px solid rgba(37,99,235,0.28)",
                    boxShadow: "0 0 24px rgba(37,99,235,0.07), 0 4px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  <motion.div
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.06) 0%, transparent 55%)" }}
                  />
                  <div className="relative p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(37,99,235,0.05))", border: "1px solid rgba(37,99,235,0.22)" }}
                      >
                        <Package2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-0.5">Categoría</div>
                        <h3 className="text-white font-bold text-lg leading-tight">{product.name}</h3>
                        {product.itemCount !== undefined && (
                          <p className="text-[#71717A] text-xs mt-0.5">{product.itemCount} productos · Promos disponibles</p>
                        )}
                      </div>
                    </div>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(37,99,235,0.14)", border: "1px solid rgba(37,99,235,0.22)" }}
                    >
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                </motion.button>
              );
            }

            const quantity = cart[product.id] || 0;

            if (product.id === "soda") return <SodaCard key={product.id} product={product} quantity={quantity} onUpdateCart={onUpdateCart} index={index} />;
            if (product.id === "frio") return <FrioCard key={product.id} product={product} quantity={quantity} onUpdateCart={onUpdateCart} index={index} />;
            if (product.id === "verde") return <VerdeCard key={product.id} product={product} quantity={quantity} onUpdateCart={onUpdateCart} index={index} />;
            return <DefaultCard key={product.id} product={product} quantity={quantity} onUpdateCart={onUpdateCart} index={index} />;
          })}
        </div>

        {promoProducts.length > 0 && (
          <div className="mt-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(250,204,21,0.3))" }} />
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-sm">✦</span>
                <span className="text-[#71717A] text-xs font-semibold uppercase tracking-widest">Promociones</span>
                <span className="text-yellow-400 text-sm">✦</span>
              </div>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(250,204,21,0.3))" }} />
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              {promoProducts.map((promo, index) => {
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
                        : "none",
                    }}
                  >
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 1.2 }}
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ background: "linear-gradient(135deg, rgba(250,204,21,0.06) 0%, transparent 60%)" }}
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
                      <p className="font-black text-white leading-tight text-base mb-1">{promo.name}</p>
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
                            className="w-full py-2 rounded-xl text-xs font-bold text-black"
                            style={{
                              background: "linear-gradient(135deg, #FACC15, #EAB308)",
                              boxShadow: "0 0 14px rgba(250,204,21,0.3)",
                            }}
                          >
                            Agregar
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {totalItems > 0 && (
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
                onClick={onContinue}
                className="w-full py-4 px-6 rounded-2xl text-white font-semibold text-base flex items-center justify-between transition-all duration-300 glow-blue"
                style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-blue-600"
                    style={{ background: "rgba(255,255,255,0.95)" }}
                  >
                    {totalItems}
                  </div>
                  <span>{totalItems === 1 ? "1 producto" : `${totalItems} productos`}</span>
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
