import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;

  @Column({ nullable: true })
  transaction_id: string;

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ nullable: true })
  payment_type: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  gross_amount: number;

  @Column({ nullable: true })
  snap_token: string;

  @Column({ nullable: true })
  snap_url: string;

  @Column({ type: 'jsonb', nullable: true })
  callback_payload: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
