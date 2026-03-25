import { Product } from './product.entity';
export declare class Category {
    id: string;
    name: string;
    slug: string;
    created_at: Date;
    products: Product[];
}
