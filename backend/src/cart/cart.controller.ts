import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Headers('x-cart-id') cartId: string) {
    if (!cartId) {
      const cart = await this.cartService.createCart();
      return {
        success: true,
        data: cart,
        message: 'New cart created',
      };
    }
    const cart = await this.cartService.getCart(cartId);
    return {
      success: true,
      data: cart,
      message: 'Cart retrieved successfully',
    };
  }

  @Post('add')
  async addToCart(@Body() dto: AddToCartDto, @Headers('x-cart-id') cartIdFromHeader: string) {
    const finalDto = { ...dto, cartId: dto.cartId || cartIdFromHeader };
    const cart = await this.cartService.addToCart(finalDto);
    return {
      success: true,
      data: cart,
      message: 'Item added to cart',
    };
  }

  @Patch('update/:itemId')
  async updateQuantity(@Param('itemId') itemId: string, @Body() dto: UpdateCartDto) {
    await this.cartService.updateQuantity(itemId, dto);
    return {
      success: true,
      data: null,
      message: 'Quantity updated',
    };
  }

  @Delete('remove/:itemId')
  async removeItem(@Param('itemId') itemId: string) {
    await this.cartService.removeItem(itemId);
    return {
      success: true,
      data: null,
      message: 'Item removed from cart',
    };
  }
}
