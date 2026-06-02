export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = "pending" | "preparing" | "on-the-way" | "delivered" | "cancelled";

export interface Order {
  id: string;
  createdAt: number;
  items: OrderItem[];
  total: number;
  address: string;
  status: OrderStatus;
  estimatedTime?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  available: boolean;
  isCategory?: boolean;
}
