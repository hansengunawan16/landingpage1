"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const payment_entity_1 = require("../entities/payment.entity");
const MidtransClient = __importStar(require("midtrans-client"));
const crypto = __importStar(require("crypto"));
let PaymentsService = PaymentsService_1 = class PaymentsService {
    orderRepository;
    paymentRepository;
    dataSource;
    logger = new common_1.Logger(PaymentsService_1.name);
    snap;
    constructor(orderRepository, paymentRepository, dataSource) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.dataSource = dataSource;
        this.snap = new MidtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-placeholder',
            clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-placeholder',
        });
    }
    async initiatePayment(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['user', 'items', 'items.inventory', 'items.inventory.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.status !== order_entity_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException('Order is not in pending status');
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
            }
            else {
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
        }
        catch (error) {
            this.logger.error('Midtrans Snap Error:', error);
            throw new common_1.BadRequestException('Failed to initiate payment');
        }
    }
    async handleWebhook(payload) {
        const { order_id, status_code, gross_amount, signature_key, transaction_status, payment_type, transaction_id, } = payload;
        const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-placeholder';
        const hash = crypto
            .createHash('sha512')
            .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
            .digest('hex');
        if (hash !== signature_key) {
            this.logger.warn(`Invalid signature for order ${order_id}`);
            throw new common_1.BadRequestException('Invalid signature');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const order = await queryRunner.manager.findOne(order_entity_1.Order, { where: { id: order_id } });
            if (!order)
                throw new common_1.NotFoundException('Order not found');
            if (order.status === order_entity_1.OrderStatus.PAID || order.status === order_entity_1.OrderStatus.CANCELLED) {
                return { success: true, message: 'Already processed' };
            }
            let newOrderStatus = order_entity_1.OrderStatus.PENDING;
            let paymentStatus = transaction_status.toUpperCase();
            if (transaction_status === 'settlement' || transaction_status === 'capture') {
                newOrderStatus = order_entity_1.OrderStatus.PAID;
            }
            else if (transaction_status === 'pending') {
                newOrderStatus = order_entity_1.OrderStatus.WAITING_PAYMENT;
            }
            else if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') {
                newOrderStatus = order_entity_1.OrderStatus.FAILED;
            }
            order.status = newOrderStatus;
            await queryRunner.manager.save(order);
            await queryRunner.manager.update(payment_entity_1.Payment, { order: { id: order_id } }, {
                status: paymentStatus,
                transaction_id,
                payment_type,
                callback_payload: payload,
            });
            await queryRunner.commitTransaction();
            return { success: true };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Webhook processing failed:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map