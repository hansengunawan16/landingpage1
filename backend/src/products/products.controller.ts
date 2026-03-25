import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  getProducts(@Query('category') category?: string) {
    return this.productsService.findAllProducts(category);
  }

  @Get('categories')
  getCategories() {
    return this.productsService.findAllCategories();
  }
}
