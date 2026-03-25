"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
const inventory_entity_1 = require("../entities/inventory.entity");
let ProductsService = class ProductsService {
    productRepository;
    categoryRepository;
    inventoryRepository;
    constructor(productRepository, categoryRepository, inventoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.inventoryRepository = inventoryRepository;
    }
    async onModuleInit() {
        console.log('[ProductsService] onModuleInit triggered');
        await this.seed();
    }
    async seed() {
        console.log('[ProductsService] Starting robust seed process...');
        const categoryData = [
            { name: 'Men', slug: 'men' },
            { name: 'Women', slug: 'women' },
            { name: 'Shoes', slug: 'shoes' },
            { name: 'Clothing', slug: 'clothing' },
            { name: 'Accessories', slug: 'accessories' },
        ];
        const categories = [];
        for (const data of categoryData) {
            let category = await this.categoryRepository.findOne({ where: { slug: data.slug } });
            if (!category) {
                category = await this.categoryRepository.save(data);
            }
            else {
                category.name = data.name;
                category = await this.categoryRepository.save(category);
            }
            categories.push(category);
        }
        const productData = [
            {
                name: 'Men Jacket',
                slug: 'men-jacket',
                description: 'Premium leather jacket for a bold look.',
                base_price: 49.99,
                category: categories.find(c => c.slug === 'men'),
                image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
                brand: 'Alpex'
            },
            {
                name: 'Men Hoodie',
                slug: 'men-hoodie',
                description: 'Classic streetwear hoodie for everyday comfort.',
                base_price: 39.99,
                category: categories.find(c => c.slug === 'men'),
                image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
                brand: 'Alpex'
            },
            {
                name: 'Men Shoes',
                slug: 'men-shoes',
                description: 'High-performance athletic sneakers.',
                base_price: 79.99,
                category: categories.find(c => c.slug === 'shoes'),
                image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
                brand: 'Alpex'
            },
            {
                name: 'Women Dress',
                slug: 'women-dress',
                description: 'Elegant floral summer dress.',
                base_price: 59.99,
                category: categories.find(c => c.slug === 'women'),
                image_url: 'https://images.unsplash.com/photo-1539008835259-46bc31454578?q=80&w=800&auto=format&fit=crop',
                brand: 'Alpex'
            },
        ];
        for (const data of productData) {
            let product = await this.productRepository.findOne({ where: { slug: data.slug } });
            if (!product) {
                product = await this.productRepository.save(data);
            }
            else {
                Object.assign(product, data);
                product = await this.productRepository.save(product);
            }
            if (product) {
                const inventoryCount = await this.inventoryRepository.count({ where: { product: { id: product.id } } });
                if (inventoryCount === 0) {
                    await this.inventoryRepository.save({
                        sku: `${product.slug.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                        size: 'M',
                        color: 'Default',
                        stock_quantity: 50,
                        product: product
                    });
                }
            }
        }
        console.log('[ProductsService] Robust seed process complete.');
    }
    findAllProducts(categorySlug) {
        return this.productRepository.find({
            where: categorySlug ? {
                category: { slug: categorySlug }
            } : {},
            relations: ['category', 'inventory']
        });
    }
    findAllCategories() {
        return this.categoryRepository.find();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map