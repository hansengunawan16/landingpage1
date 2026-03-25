import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<{
        success: boolean;
        data: {
            order_id: string;
            status: import("../entities/order.entity").OrderStatus;
            total: number;
        };
        message: string;
    }>;
    findAll(userId: string): Promise<{
        success: boolean;
        data: import("../entities/order.entity").Order[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("../entities/order.entity").Order;
    }>;
}
