import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(cartId: string): Promise<{
        success: boolean;
        data: import("../entities/cart.entity").Cart;
        message: string;
    }>;
    addToCart(dto: AddToCartDto, cartIdFromHeader: string): Promise<{
        success: boolean;
        data: import("../entities/cart.entity").Cart;
        message: string;
    }>;
    updateQuantity(itemId: string, dto: UpdateCartDto): Promise<{
        success: boolean;
        data: null;
        message: string;
    }>;
    removeItem(itemId: string): Promise<{
        success: boolean;
        data: null;
        message: string;
    }>;
}
