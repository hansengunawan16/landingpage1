import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  inventoryId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (inventoryId: string) => void;
  updateQuantity: (inventoryId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.inventoryId === item.inventoryId);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.inventoryId === item.inventoryId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (inventoryId) => set((state) => ({
        items: state.items.filter((i) => i.inventoryId !== inventoryId),
      })),
      updateQuantity: (inventoryId, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.inventoryId === inventoryId ? { ...i, quantity } : i
        ),
      })),
      clearCart: () => set({ items: [] }),
      toggleCart: (open) => set((state) => ({ isOpen: open ?? !state.isOpen })),
    }),
    {
      name: 'alpex-cart-storage',
    }
  )
);
