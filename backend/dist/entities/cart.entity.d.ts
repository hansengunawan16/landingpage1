import { CartItem } from './cart-item.entity';
import { User } from './user.entity';
export declare class Cart {
    id: string;
    user: User;
    created_at: Date;
    updated_at: Date;
    items: CartItem[];
}
