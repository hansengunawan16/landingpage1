"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const category_entity_1 = require("./entities/category.entity");
const product_entity_1 = require("./entities/product.entity");
const inventory_entity_1 = require("./entities/inventory.entity");
const cart_entity_1 = require("./entities/cart.entity");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const products_module_1 = require("./products/products.module");
const cart_module_1 = require("./cart/cart.module");
const orders_module_1 = require("./orders/orders.module");
const payments_module_1 = require("./payments/payments.module");
const user_entity_1 = require("./entities/user.entity");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const payment_entity_1 = require("./entities/payment.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'database',
                port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
                username: process.env.DB_USER || 'alpex_user',
                password: process.env.DB_PASSWORD || 'alpex_pass',
                database: process.env.DB_NAME || 'alpex_db',
                entities: [category_entity_1.Category, product_entity_1.Product, inventory_entity_1.Inventory, cart_entity_1.Cart, cart_item_entity_1.CartItem, user_entity_1.User, order_entity_1.Order, order_item_entity_1.OrderItem, payment_entity_1.Payment],
                synchronize: true,
                logging: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([
                category_entity_1.Category,
                product_entity_1.Product,
                inventory_entity_1.Inventory,
                cart_entity_1.Cart,
                cart_item_entity_1.CartItem,
            ]),
            products_module_1.ProductsModule,
            cart_module_1.CartModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map