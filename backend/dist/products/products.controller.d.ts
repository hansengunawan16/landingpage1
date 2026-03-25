import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getProducts(category?: string): Promise<import("../entities/product.entity").Product[]>;
    getCategories(): Promise<import("../entities/category.entity").Category[]>;
}
