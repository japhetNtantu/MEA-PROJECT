import { Pizza } from './pizza.model';

export interface CartItem {
  pizza: Pizza;
  quantity: number;
}