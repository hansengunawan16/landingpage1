import { Repository, DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Payment } from '../entities/payment.entity';
export declare class PaymentsService {
    private orderRepository;
    private paymentRepository;
    private dataSource;
    private readonly logger;
    private snap;
    constructor(orderRepository: Repository<Order>, paymentRepository: Repository<Payment>, dataSource: DataSource);
    initiatePayment(orderId: string): Promise<{
        success: boolean;
        data: {
            payment_url: any;
            token: any;
        };
    }>;
    handleWebhook(payload: any): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
}
