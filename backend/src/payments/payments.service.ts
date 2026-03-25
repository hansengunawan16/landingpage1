import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { Payment } from '../entities/payment.entity';
// @ts-ignore
import * as MidtransClient from 'midtrans-client';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private snap: any;

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private dataSource: DataSource,
  ) {
    this.snap = new MidtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-placeholder',
      clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-placeholder',
    });
  }

  async initiatePayment(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.inventory', 'items.inventory.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not in pending status');
    }

    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: Math.round(Number(order.total_amount)),
      },
      item_details: order.items.map((item) => ({
        id: item.inventory.id,
        price: Math.round(Number(item.purchased_price)),
        quantity: item.quantity,
        name: item.inventory.product.name,
      })),
      customer_details: {
        first_name: order.shipping_name,
        email: order.user?.email || 'guest@alpex.co',
        phone: order.shipping_phone,
      },
    };

    try {
      const transaction = await this.snap.createTransaction(parameter);
      
      let payment = await this.paymentRepository.findOne({ where: { order: { id: order.id } } });
      if (!payment) {
        payment = this.paymentRepository.create({
          order,
          gross_amount: order.total_amount,
          status: 'PENDING',
          snap_token: transaction.token,
          snap_url: transaction.redirect_url,
        });
      } else {
        payment.snap_token = transaction.token;
        payment.snap_url = transaction.redirect_url;
      }
      
      await this.paymentRepository.save(payment);

      return {
        success: true,
        data: {
          payment_url: transaction.redirect_url,
          token: transaction.token,
        },
      };
    } catch (error) {
      this.logger.error('Midtrans Snap Error:', error);
      throw new BadRequestException('Failed to initiate payment');
    }
  }

  async handleWebhook(payload: any) {
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      transaction_id,
    } = payload;

    // 1. Verify Signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-placeholder';
    const hash = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (hash !== signature_key) {
      this.logger.warn(`Invalid signature for order ${order_id}`);
      throw new BadRequestException('Invalid signature');
    }

    // 2. Process Status Mapping
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, { where: { id: order_id } });
      if (!order) throw new NotFoundException('Order not found');

      // Idempotency: Ignore if already processed
      if (order.status === OrderStatus.PAID || order.status === OrderStatus.CANCELLED) {
        return { success: true, message: 'Already processed' };
      }

      let newOrderStatus = OrderStatus.PENDING;
      let paymentStatus = transaction_status.toUpperCase();

      if (transaction_status === 'settlement' || transaction_status === 'capture') {
        newOrderStatus = OrderStatus.PAID;
      } else if (transaction_status === 'pending') {
        newOrderStatus = OrderStatus.WAITING_PAYMENT;
      } else if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') {
        newOrderStatus = OrderStatus.FAILED;
      }

      // Update Order
      order.status = newOrderStatus;
      await queryRunner.manager.save(order);

      // Update Payment
      await queryRunner.manager.update(Payment, { order: { id: order_id } }, {
        status: paymentStatus,
        transaction_id,
        payment_type,
        callback_payload: payload,
      });

      await queryRunner.commitTransaction();
      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Webhook processing failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
