import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { Inventory } from '../entities/inventory.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
export declare class CartService {
    private cartRepository;
    private cartItemRepository;
    private inventoryRepository;
    constructor(cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, inventoryRepository: Repository<Inventory>);
    getCart(cartId: string): Promise<Cart>;
    createCart(): Promise<Cart>;
    addToCart(dto: AddToCartDto): Promise<Cart>;
    updateQuantity(itemId: string, dto: UpdateCartDto): Promise<{
        success: boolean;
    }>;
    removeItem(itemId: string): Promise<{
        success: boolean;
    }>;
}
