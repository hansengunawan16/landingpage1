import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Inventory } from './entities/inventory.entity';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { User } from './entities/user.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'database',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USER || 'alpex_user',
      password: process.env.DB_PASSWORD || 'alpex_pass',
      database: process.env.DB_NAME || 'alpex_db',
      entities: [Category, Product, Inventory, Cart, CartItem, User, Order, OrderItem, Payment],
      synchronize: true, // Auto-sync schema in dev mode
      logging: true,
    }),
    TypeOrmModule.forFeature([
      Category,
      Product,
      Inventory,
      Cart,
      CartItem,
    ]),
    ProductsModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
