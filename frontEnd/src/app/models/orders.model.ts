import { Customer } from './users.model';
import { Pizza } from './pizza.model';

export type OrderStatus = 'pending' | 'preparing' | 'delivered';

export interface OrderItem {
  customer_id?: string; 
  pizza_id: string;
  quantity: number;
}

export interface Order {
  id: string; 
  customer: Customer;
  created_at: Date;
  status: OrderStatus;
  items: OrderItem[];
}