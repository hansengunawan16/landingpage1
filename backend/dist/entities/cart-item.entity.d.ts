import { Cart } from './cart.entity';
import { Inventory } from './inventory.entity';
export declare class CartItem {
    id: string;
    quantity: number;
    cart: Cart;
    inventory: Inventory;
}
