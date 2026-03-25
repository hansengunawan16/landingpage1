import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Inventory } from '../entities/inventory.entity';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async onModuleInit() {
    console.log('[ProductsService] onModuleInit triggered');
    await this.seed();
  }

  async seed() {
    console.log('[ProductsService] Starting robust seed process...');
    
    // Seed Categories with upsert logic
    const categoryData = [
      { name: 'Men', slug: 'men' },
      { name: 'Women', slug: 'women' },
      { name: 'Shoes', slug: 'shoes' },
      { name: 'Clothing', slug: 'clothing' },
      { name: 'Accessories', slug: 'accessories' },
    ];

    const categories: Category[] = [];
    for (const data of categoryData) {
      let category = await this.categoryRepository.findOne({ where: { slug: data.slug } });
      if (!category) {
        category = await this.categoryRepository.save(data);
      } else {
        // Update name if changed
        category.name = data.name;
        category = await this.categoryRepository.save(category);
      }
      categories.push(category);
    }

    // Seed Products with upsert logic
    const productData = [
      {
        name: 'Men Jacket',
        slug: 'men-jacket',
        description: 'Premium leather jacket for a bold look.',
        base_price: 49.99,
        category: categories.find(c => c.slug === 'men')!,
        image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
        brand: 'Alpex'
      },
      {
        name: 'Men Hoodie',
        slug: 'men-hoodie',
        description: 'Classic streetwear hoodie for everyday comfort.',
        base_price: 39.99,
        category: categories.find(c => c.slug === 'men')!,
        image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
        brand: 'Alpex'
      },
      {
        name: 'Men Shoes',
        slug: 'men-shoes',
        description: 'High-performance athletic sneakers.',
        base_price: 79.99,
        category: categories.find(c => c.slug === 'shoes')!,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
        brand: 'Alpex'
      },
      {
        name: 'Women Dress',
        slug: 'women-dress',
        description: 'Elegant floral summer dress.',
        base_price: 59.99,
        category: categories.find(c => c.slug === 'women')!,
        image_url: 'https://images.unsplash.com/photo-1539008835259-46bc31454578?q=80&w=800&auto=format&fit=crop',
        brand: 'Alpex'
      },
    ];

    for (const data of productData) {
      let product = await this.productRepository.findOne({ where: { slug: data.slug } });
      if (!product) {
        product = await this.productRepository.save(data as any);
      } else {
        // Update fields
        Object.assign(product, data);
        product = await this.productRepository.save(product);
      }
      
      if (product) {
        // Seed Inventory for each product if none exists
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

  findAllProducts(categorySlug?: string) {
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
}
