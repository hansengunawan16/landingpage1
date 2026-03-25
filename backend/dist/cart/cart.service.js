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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("../entities/cart.entity");
const cart_item_entity_1 = require("../entities/cart-item.entity");
const inventory_entity_1 = require("../entities/inventory.entity");
let CartService = class CartService {
    cartRepository;
    cartItemRepository;
    inventoryRepository;
    constructor(cartRepository, cartItemRepository, inventoryRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.inventoryRepository = inventoryRepository;
    }
    async getCart(cartId) {
        const cart = await this.cartRepository.findOne({
            where: { id: cartId },
            relations: ['items', 'items.inventory', 'items.inventory.product'],
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        return cart;
    }
    async createCart() {
        return this.cartRepository.save({});
    }
    async addToCart(dto) {
        let cart;
        if (dto.cartId) {
            cart = await this.cartRepository.findOne({
                where: { id: dto.cartId },
                relations: ['items', 'items.inventory'],
            });
        }
        if (!cart) {
            cart = await this.cartRepository.save({});
        }
        const inventory = await this.inventoryRepository.findOne({
            where: { id: dto.inventoryId },
        });
        if (!inventory) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        if (inventory.stock_quantity < dto.quantity) {
            throw new common_1.ConflictException('Insufficient stock');
        }
        let cartItem = cart.items?.find((item) => item.inventory.id === dto.inventoryId);
        if (cartItem) {
            const newQuantity = cartItem.quantity + dto.quantity;
            if (inventory.stock_quantity < newQuantity) {
                throw new common_1.ConflictException('Insufficient stock for update');
            }
            cartItem.quantity = newQuantity;
            await this.cartItemRepository.save(cartItem);
        }
        else {
            cartItem = this.cartItemRepository.create({
                cart,
                inventory,
                quantity: dto.quantity,
            });
            await this.cartItemRepository.save(cartItem);
        }
        return this.getCart(cart.id);
    }
    async updateQuantity(itemId, dto) {
        const cartItem = await this.cartItemRepository.findOne({
            where: { id: itemId },
            relations: ['inventory'],
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Item not found in cart');
        }
        if (cartItem.inventory.stock_quantity < dto.quantity) {
            throw new common_1.ConflictException('Insufficient stock');
        }
        cartItem.quantity = dto.quantity;
        await this.cartItemRepository.save(cartItem);
        return { success: true };
    }
    async removeItem(itemId) {
        const result = await this.cartItemRepository.delete(itemId);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Item not found');
        }
        return { success: true };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(2, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map