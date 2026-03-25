import { IsUUID, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  cartId: string;

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  @IsNotEmpty()
  shippingName: string;

  @IsString()
  @IsNotEmpty()
  shippingPhone: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
