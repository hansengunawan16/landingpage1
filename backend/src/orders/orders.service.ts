import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Cart } from '../entities/cart.entity';
import { Inventory } from '../entities/inventory.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private dataSource: DataSource,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Fetch Cart
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { id: dto.cartId },
        relations: ['items', 'items.inventory', 'items.inventory.product'],
      });

      if (!cart || cart.items.length === 0) {
        throw new NotFoundException('Cart not found or empty');
      }

      // 2. Fetch User (Minimal fallback for now)
      let user: User | null = null;
      if (dto.userId) {
        user = await queryRunner.manager.findOne(User, { where: { id: dto.userId } });
      }

      // 3. Create Order Header
      const order = queryRunner.manager.create(Order, {
        user: user as any, // Cast to any or handle properly if User is nullable
        status: OrderStatus.PENDING,
        shipping_address: dto.shippingAddress,
        shipping_name: dto.shippingName,
        shipping_phone: dto.shippingPhone,
        total_amount: 0,
      });

      const savedOrder = await queryRunner.manager.save(order);

      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      // 4. Process items & Reduce Inventory
      for (const cartItem of cart.items) {
        // Lock inventory row for update to prevent race conditions
        const inventory = await queryRunner.manager.findOne(Inventory, {
          where: { id: cartItem.inventory.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!inventory || inventory.stock_quantity < cartItem.quantity) {
          throw new ConflictException(`Insufficient stock for ${cartItem.inventory.sku}`);
        }

        // Deduct stock
        inventory.stock_quantity -= cartItem.quantity;
        await queryRunner.manager.save(inventory);

        // Create OrderItem (snapshot price)
        const orderItem = queryRunner.manager.create(OrderItem, {
          order: savedOrder,
          inventory: cartItem.inventory,
          quantity: cartItem.quantity,
          purchased_price: cartItem.inventory.product.base_price, // Snapshot current price
        });

        totalAmount += Number(orderItem.purchased_price) * cartItem.quantity;
        orderItems.push(orderItem);
      }

      // 5. Update Order Total
      savedOrder.total_amount = totalAmount;
      await queryRunner.manager.save(savedOrder);
      await queryRunner.manager.save(orderItems);

      // 6. Clear Cart Items
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      console.error('Order creation failed:', error);
      throw new InternalServerErrorException('Failed to process order');
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByUser(userId: string) {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
    return { success: true, data: orders };
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.inventory', 'items.inventory.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return { success: true, data: order };
  }
}
