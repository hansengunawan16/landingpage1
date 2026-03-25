import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "PENDING",
    WAITING_PAYMENT = "WAITING_PAYMENT",
    PAID = "PAID",
    SHIPPED = "SHIPPED",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED",
    EXPIRED = "EXPIRED"
}
export declare class Order {
    id: string;
    user: User;
    status: OrderStatus;
    total_amount: number;
    shipping_address: string;
    shipping_name: string;
    shipping_phone: string;
    items: OrderItem[];
    created_at: Date;
}
