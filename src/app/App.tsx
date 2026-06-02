import { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { HomeScreen } from "./components/HomeScreen";
import { ProductCatalog, Product } from "./components/ProductCatalog";
import { Cart, AllItems } from "./components/Cart";
import { LocationForm } from "./components/LocationForm";
import { OrderConfirmation } from "./components/OrderConfirmation";
import { CategoryScreen, CategoryItem, Promo } from "./components/CategoryScreen";
import { saveOrder, getAdminProducts } from "./admin/store";
import { AdminProduct } from "./admin/types";

type Screen = "home" | "products" | "cart" | "location" | "confirmation" | "prerolls" | "comestibles";

const BASE_REGULAR_PRODUCTS: Product[] = [
  { id: "soda", name: "Soda", price: 140, image: "/images/09fed79a-41e2-4c6a-b19a-c78b93d7c0e6.jpg" },
  { id: "soda-lavada", name: "Soda Lavada", price: 500, image: "/images/OIP.jpg" },
  { id: "verde", name: "Verde", price: 140, image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { id: "frio", name: "Frío", price: 140, image: "/images/0eaf463f-8af7-4b29-bbe2-b4553197254c.jpg" },
];

const BASE_CATEGORY_PRODUCTS: Product[] = [
  { id: "cat-prerolls", name: "Pre-rolls", price: 0, type: "category", categoryKey: "prerolls", itemCount: 4 },
  { id: "cat-comestibles", name: "Comestibles", price: 0, type: "category", categoryKey: "comestibles", itemCount: 2 },
];

const PREROLLS_ITEMS: CategoryItem[] = [
  { id: "preroll-uva", name: "Blunt Wrap XXL Uva", price: 80 },
  { id: "preroll-blueberry", name: "Blunt Wrap XXL Blueberry", price: 80 },
  { id: "preroll-chocolate", name: "Blunt Wrap XXL Chocolate Amargo", price: 90 },
  { id: "preroll-mango", name: "Blunt Wrap XXL Mango", price: 85 },
];

const PREROLLS_PROMOS: Promo[] = [
  { id: "promo-prerolls-2x150", name: "Promo Pre-rolls 2x150", price: 150, label: "2 × $150", description: "2 Pre-rolls a elección", savings: "Ahorra hasta $60" },
  { id: "promo-prerolls-3x220", name: "Promo Pre-rolls 3x220", price: 220, label: "3 × $220", description: "3 Pre-rolls a elección", savings: "Ahorra hasta $50" },
];

const COMESTIBLES_ITEMS: CategoryItem[] = [
  { id: "comestible-brownie", name: "Brownies de chocolate", price: 80 },
  { id: "comestible-galletas", name: "Galletas con chispas de chocolate", price: 80 },
];

const COMESTIBLES_PROMOS: Promo[] = [
  { id: "promo-comestibles-2x150", name: "Promo Comestibles 2x150", price: 150, label: "2 × $150", description: "2 Comestibles a elección", savings: "Ahorra $10" },
  { id: "promo-comestibles-3x220", name: "Promo Comestibles 3x220", price: 220, label: "3 × $220", description: "3 Comestibles a elección", savings: "Ahorra $20" },
];

const STATIC_ITEMS: AllItems = Object.fromEntries(
  [
    ...BASE_REGULAR_PRODUCTS,
    ...PREROLLS_ITEMS,
    ...COMESTIBLES_ITEMS,
    ...PREROLLS_PROMOS,
    ...COMESTIBLES_PROMOS,
  ].map(item => [item.id, { name: item.name, price: item.price }])
);

function applyAdminOverrides(base: Product[], adminProds: AdminProduct[]): Product[] {
  return base
    .map(p => {
      const ap = adminProds.find(a => a.id === p.id);
      if (!ap) return p;
      return { ...p, name: ap.name, price: ap.isCategory ? p.price : ap.price };
    })
    .filter(p => {
      const ap = adminProds.find(a => a.id === p.id);
      return ap ? ap.available : true;
    });
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [address, setAddress] = useState("");
  const [adminProds, setAdminProds] = useState<AdminProduct[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getAdminProducts().then(setAdminProds).catch(() => {});
  }, []);

  const regularProducts = useMemo(() => applyAdminOverrides(BASE_REGULAR_PRODUCTS, adminProds), [adminProds]);
  const categoryProducts = useMemo(() => applyAdminOverrides(BASE_CATEGORY_PRODUCTS, adminProds), [adminProds]);
  const allDisplayProducts = useMemo(() => [...regularProducts, ...categoryProducts], [regularProducts, categoryProducts]);

  const allItems: AllItems = useMemo(() => {
    const overrideEntries = regularProducts.map(p => [p.id, { name: p.name, price: p.price }] as const);
    return { ...STATIC_ITEMS, ...Object.fromEntries(overrideEntries) };
  }, [regularProducts]);

  const totalCartItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalCartPrice = Object.entries(cart).reduce(
    (sum, [id, qty]) => sum + (allItems[id]?.price ?? 0) * qty,
    0
  );

  const handleUpdateCart = (productId: string, quantity: number) => {
    setCart(prev => {
      if (quantity === 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: quantity };
    });
  };

  const handleSendWhatsApp = async () => {
    if (sending) return;
    setSending(true);

    const cartEntries = Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, quantity]) => ({
        name: allItems[id]?.name ?? id,
        price: allItems[id]?.price ?? 0,
        quantity,
      }));

    const total = cartEntries.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderId = `TP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    try {
      await saveOrder({
        id: orderId,
        createdAt: Date.now(),
        items: cartEntries,
        total,
        address,
        status: "pending",
      });
    } catch (err) {
      console.error("Error guardando pedido en Supabase:", err);
    } finally {
      setSending(false);
    }

    const trackingUrl = `${window.location.origin}/track/${orderId}`;

    let message = `*🛍️ Nuevo Pedido - Thepoint*\n*ID: ${orderId}*\n\n`;
    message += "*Productos:*\n";
    cartEntries.forEach(item => {
      message += `• ${item.name} x${item.quantity} - $${item.price * item.quantity}\n`;
    });
    message += `\n*Total: $${total}*\n\n`;
    message += `*📍 Dirección de entrega:*\n${address}\n\n`;
    message += `*💵 Método de pago:* Efectivo\n\n`;
    message += `*🔍 Seguimiento:* ${trackingUrl}`;

    const phoneNumber = "5213411156618";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setCart({});
    setAddress("");
  };

  return (
    <div className="size-full dark">
      <AnimatePresence mode="wait">
        {currentScreen === "home" && (
          <HomeScreen key="home" onStartOrder={() => setCurrentScreen("products")} />
        )}

        {currentScreen === "products" && (
          <ProductCatalog
            key="products"
            products={allDisplayProducts}
            cart={cart}
            totalCartPrice={totalCartPrice}
            onUpdateCart={handleUpdateCart}
            onContinue={() => setCurrentScreen("cart")}
            onOpenCategory={(key) => setCurrentScreen(key as Screen)}
          />
        )}

        {currentScreen === "prerolls" && (
          <CategoryScreen
            key="prerolls"
            title="Pre-rolls"
            menuLabel="MENÚ PRE ROLLS XXL"
            items={PREROLLS_ITEMS}
            promos={PREROLLS_PROMOS}
            cart={cart}
            totalCartItems={totalCartItems}
            totalCartPrice={totalCartPrice}
            onUpdateCart={handleUpdateCart}
            onBack={() => setCurrentScreen("products")}
            onViewCart={() => setCurrentScreen("cart")}
          />
        )}

        {currentScreen === "comestibles" && (
          <CategoryScreen
            key="comestibles"
            title="Comestibles"
            menuLabel="MENÚ COMESTIBLES"
            items={COMESTIBLES_ITEMS}
            promos={COMESTIBLES_PROMOS}
            cart={cart}
            totalCartItems={totalCartItems}
            totalCartPrice={totalCartPrice}
            onUpdateCart={handleUpdateCart}
            onBack={() => setCurrentScreen("products")}
            onViewCart={() => setCurrentScreen("cart")}
          />
        )}

        {currentScreen === "cart" && (
          <Cart
            key="cart"
            allItems={allItems}
            cart={cart}
            onBack={() => setCurrentScreen("products")}
            onContinue={() => setCurrentScreen("location")}
          />
        )}

        {currentScreen === "location" && (
          <LocationForm
            key="location"
            onBack={() => setCurrentScreen("cart")}
            onContinue={(addr) => {
              setAddress(addr);
              setCurrentScreen("confirmation");
            }}
          />
        )}

        {currentScreen === "confirmation" && (
          <OrderConfirmation
            key="confirmation"
            allItems={allItems}
            cart={cart}
            address={address}
            onSendWhatsApp={handleSendWhatsApp}
            onBackToHome={handleBackToHome}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
