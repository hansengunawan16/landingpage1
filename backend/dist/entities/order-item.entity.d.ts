import { Order } from './order.entity';
import { Inventory } from './inventory.entity';
export declare class OrderItem {
    id: string;
    order: Order;
    inventory: Inventory;
    quantity: number;
    purchased_price: number;
}
