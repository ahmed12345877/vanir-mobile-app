import React, { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import type { TravelBookingRequest, TravelEssentialCategory, TravelEssentialsCheckoutRequest } from '../services/travelBooking';

type CartItemBase = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  imageUrl?: string;
};

export type PackageCartItem = CartItemBase & {
  kind: 'package';
  payload: {
    packageName: string;
    guestName: string;
    guestEmail: string;
    adults: number;
    children: number;
    dateFrom: string;
    dateTo: string;
    travelStyle: string;
    specialRequests: string;
  };
};

export type FlightCartItem = CartItemBase & {
  kind: 'flight';
  payload: TravelBookingRequest;
};

export type HotelCartItem = CartItemBase & {
  kind: 'hotel';
  payload: TravelBookingRequest;
};

export type EssentialCartItem = CartItemBase & {
  kind: 'essential';
  category: TravelEssentialCategory;
  payload: TravelEssentialsCheckoutRequest;
};

export type CartItem = PackageCartItem | FlightCartItem | HotelCartItem | EssentialCartItem;

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems(current => {
      const existingIndex = current.findIndex(entry => entry.id === item.id);
      if (existingIndex === -1) {
        return [...current, item];
      }

      return current.map(entry => (entry.id === item.id ? item : entry));
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.length,
      addItem,
      removeItem,
      clearCart,
    }),
    [addItem, clearCart, items, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider.');
  }

  return context;
}