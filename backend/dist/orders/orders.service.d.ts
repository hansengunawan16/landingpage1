import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private orderRepository;
    private dataSource;
    constructor(orderRepository: Repository<Order>, dataSource: DataSource);
    createOrder(dto: CreateOrderDto): Promise<{
        success: boolean;
        data: {
            order_id: string;
            status: OrderStatus;
            total: number;
        };
        message: string;
    }>;
    findAllByUser(userId: string): Promise<{
        success: boolean;
        data: Order[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: Order;
    }>;
}
