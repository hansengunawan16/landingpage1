import { Order } from './order.entity';
import { Cart } from './cart.entity';
export declare class User {
    id: string;
    email: string;
    password?: string;
    full_name: string;
    orders: Order[];
    carts: Cart[];
    created_at: Date;
    updated_at: Date;
}
