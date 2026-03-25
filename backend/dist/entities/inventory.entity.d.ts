import { Product } from './product.entity';
export declare class Inventory {
    id: string;
    sku: string;
    size: string;
    color: string;
    stock_quantity: number;
    product: Product;
}
