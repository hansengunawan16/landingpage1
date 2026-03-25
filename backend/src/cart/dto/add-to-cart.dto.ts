import { IsUUID, IsInt, Min, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  inventoryId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsUUID()
  cartId?: string;
}
