import { Order } from './order.entity';
export declare class Payment {
    id: string;
    order: Order;
    transaction_id: string;
    status: string;
    payment_type: string;
    gross_amount: number;
    snap_token: string;
    snap_url: string;
    callback_payload: any;
    created_at: Date;
    updated_at: Date;
}
