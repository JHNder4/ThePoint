import { supabase } from "../../lib/supabase";
import { Order, AdminProduct } from "./types";

const SESSION_KEY = "tp_admin_session";
export const ADMIN_PASSWORD = "thepoint";

export const DEFAULT_ADMIN_PRODUCTS: AdminProduct[] = [
  { id: "soda", name: "Soda", price: 140, image: "/images/09fed79a-41e2-4c6a-b19a-c78b93d7c0e6.jpg", available: true },
  { id: "soda-lavada", name: "Soda Lavada", price: 500, image: "/images/OIP.jpg", available: true },
  { id: "verde", name: "Verde", price: 140, image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", available: true },
  { id: "frio", name: "Frío", price: 140, image: "/images/0eaf463f-8af7-4b29-bbe2-b4553197254c.jpg", available: true },
  { id: "cat-prerolls", name: "Pre-rolls", price: 0, image: "", available: true, isCategory: true },
  { id: "cat-comestibles", name: "Comestibles", price: 0, image: "", available: true, isCategory: true },
];

function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    createdAt: row.created_at as number,
    items: row.items as Order["items"],
    total: row.total as number,
    address: row.address as string,
    status: row.status as Order["status"],
    estimatedTime: (row.estimated_time as string | null) ?? undefined,
  };
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data ? rowToOrder(data) : null;
}

export async function saveOrder(order: Order): Promise<void> {
  const { error } = await supabase.from("orders").insert({
    id: order.id,
    created_at: order.createdAt,
    items: order.items,
    total: order.total,
    address: order.address,
    status: order.status,
    estimated_time: order.estimatedTime ?? null,
  });
  if (error) throw error;
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function updateOrderEta(id: string, estimatedTime: string): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ estimated_time: estimatedTime })
    .eq("id", id);
  if (error) throw error;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*");
  if (error || !data || data.length === 0) return DEFAULT_ADMIN_PRODUCTS;
  return data.map(row => ({
    id: row.id as string,
    name: row.name as string,
    price: row.price as number,
    image: row.image as string,
    available: row.available as boolean,
    isCategory: row.is_category as boolean,
  }));
}

export async function saveAdminProducts(products: AdminProduct[]): Promise<void> {
  for (const p of products) {
    const { error } = await supabase
      .from("products")
      .upsert({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        available: p.available,
        is_category: p.isCategory ?? false,
      }, { onConflict: "id" });
    if (error) throw error;
  }
}

export async function getNewOrderCount(lastSeen: number): Promise<number> {
  const { count, error } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .gt("created_at", lastSeen);
  if (error) return 0;
  return count ?? 0;
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

export function loginAdmin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "true");
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
