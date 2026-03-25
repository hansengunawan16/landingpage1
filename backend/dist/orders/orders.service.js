"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const cart_entity_1 = require("../entities/cart.entity");
const inventory_entity_1 = require("../entities/inventory.entity");
const user_entity_1 = require("../entities/user.entity");
let OrdersService = class OrdersService {
    orderRepository;
    dataSource;
    constructor(orderRepository, dataSource) {
        this.orderRepository = orderRepository;
        this.dataSource = dataSource;
    }
    async createOrder(dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const cart = await queryRunner.manager.findOne(cart_entity_1.Cart, {
                where: { id: dto.cartId },
                relations: ['items', 'items.inventory', 'items.inventory.product'],
            });
            if (!cart || cart.items.length === 0) {
                throw new common_1.NotFoundException('Cart not found or empty');
            }
            let user = null;
            if (dto.userId) {
                user = await queryRunner.manager.findOne(user_entity_1.User, { where: { id: dto.userId } });
            }
            const order = queryRunner.manager.create(order_entity_1.Order, {
                user: user,
                status: order_entity_1.OrderStatus.PENDING,
                shipping_address: dto.shippingAddress,
                shipping_name: dto.shippingName,
                shipping_phone: dto.shippingPhone,
                total_amount: 0,
            });
            const savedOrder = await queryRunner.manager.save(order);
            let totalAmount = 0;
            const orderItems = [];
            for (const cartItem of cart.items) {
                const inventory = await queryRunner.manager.findOne(inventory_entity_1.Inventory, {
                    where: { id: cartItem.inventory.id },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!inventory || inventory.stock_quantity < cartItem.quantity) {
                    throw new common_1.ConflictException(`Insufficient stock for ${cartItem.inventory.sku}`);
                }
                inventory.stock_quantity -= cartItem.quantity;
                await queryRunner.manager.save(inventory);
                const orderItem = queryRunner.manager.create(order_item_entity_1.OrderItem, {
                    order: savedOrder,
                    inventory: cartItem.inventory,
                    quantity: cartItem.quantity,
                    purchased_price: cartItem.inventory.product.base_price,
                });
                totalAmount += Number(orderItem.purchased_price) * cartItem.quantity;
                orderItems.push(orderItem);
            }
            savedOrder.total_amount = totalAmount;
            await queryRunner.manager.save(savedOrder);
            await queryRunner.manager.save(orderItems);
            await queryRunner.manager.delete('cart_items', { cart: { id: cart.id } });
            await queryRunner.commitTransaction();
            return {
                success: true,
                data: {
                    order_id: savedOrder.id,
                    status: savedOrder.status,
                    total: savedOrder.total_amount,
                },
                message: 'Order created successfully',
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            console.error('Order creation failed:', error);
            throw new common_1.InternalServerErrorException('Failed to process order');
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAllByUser(userId) {
        const orders = await this.orderRepository.find({
            where: { user: { id: userId } },
            order: { created_at: 'DESC' },
        });
        return { success: true, data: orders };
    }
    async findOne(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['items', 'items.inventory', 'items.inventory.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return { success: true, data: order };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map