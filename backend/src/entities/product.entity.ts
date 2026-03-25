import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Inventory } from './inventory.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 12, scale: 2 })
  base_price: number;

  @Column({ default: true })
  is_active: boolean;

  @Column('jsonb', { nullable: true })
  metadata: any;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  brand: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventory: Inventory[];
}
