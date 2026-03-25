import { Category } from './category.entity';
import { Inventory } from './inventory.entity';
export declare class Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    base_price: number;
    is_active: boolean;
    metadata: any;
    image_url: string;
    brand: string;
    created_at: Date;
    category: Category;
    inventory: Inventory[];
}
