import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Inventory } from '../entities/inventory.entity';
export declare class ProductsService implements OnModuleInit {
    private productRepository;
    private categoryRepository;
    private inventoryRepository;
    constructor(productRepository: Repository<Product>, categoryRepository: Repository<Category>, inventoryRepository: Repository<Inventory>);
    onModuleInit(): Promise<void>;
    seed(): Promise<void>;
    findAllProducts(categorySlug?: string): Promise<Product[]>;
    findAllCategories(): Promise<Category[]>;
}
