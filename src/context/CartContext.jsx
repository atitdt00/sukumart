"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  //check whether two cart items are the same product
  //with the same selected variants
  const isSameCartItem = (item, product) => {
    return (
      item._id === product._id &&
      JSON.stringify(item.selectedVariants || {}) ===
        JSON.stringify(product.selectedVariants || {})
    );
  };

  //add product to cart
  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) =>
          isSameCartItem(item, product)
      );

      //product already exists
      if (existingProduct) {
        return currentCart.map((item) =>
          isSameCartItem(item, product)
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      //New Product
      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  //Remove product completely from cart
  const removeFromCart = (ProductId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => !isSameCartItem(item, ProductId)),
    );
  };

  //Increase Quantity
  const increaseQuantity = (ProductId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        isSameCartItem(item, ProductId)
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  //descrease quantity
  const decreaseQuantity = (ProductId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
       isSameCartItem(item, ProductId)
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ).filter((item)=> item.quantity > 0),
    );
  };

  //clear cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
