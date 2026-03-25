import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { Inventory } from '../entities/inventory.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async getCart(cartId: string) {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.inventory', 'items.inventory.product'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async createCart() {
    return this.cartRepository.save({});
  }

  async addToCart(dto: AddToCartDto) {
    let cart: Cart | undefined | null;
    if (dto.cartId) {
      cart = await this.cartRepository.findOne({
        where: { id: dto.cartId },
        relations: ['items', 'items.inventory'],
      });
    }

    if (!cart) {
      cart = await this.cartRepository.save({});
    }

    const inventory = await this.inventoryRepository.findOne({
      where: { id: dto.inventoryId },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    if (inventory.stock_quantity < dto.quantity) {
      throw new ConflictException('Insufficient stock');
    }

    let cartItem = cart.items?.find((item) => item.inventory.id === dto.inventoryId);

    if (cartItem) {
      const newQuantity = cartItem.quantity + dto.quantity;
      if (inventory.stock_quantity < newQuantity) {
        throw new ConflictException('Insufficient stock for update');
      }
      cartItem.quantity = newQuantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        inventory,
        quantity: dto.quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return this.getCart(cart.id);
  }

  async updateQuantity(itemId: string, dto: UpdateCartDto) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId },
      relations: ['inventory'],
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    if (cartItem.inventory.stock_quantity < dto.quantity) {
      throw new ConflictException('Insufficient stock');
    }

    cartItem.quantity = dto.quantity;
    await this.cartItemRepository.save(cartItem);

    // Return cart ID or handle as needed
    return { success: true };
  }

  async removeItem(itemId: string) {
    const result = await this.cartItemRepository.delete(itemId);
    if (result.affected === 0) {
      throw new NotFoundException('Item not found');
    }
    return { success: true };
  }
}
