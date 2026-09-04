"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  //add product to cart
  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item._id === product._id,
      );

      //product already exists
      if (existingProduct) {
        return currentCart.map((item) =>
          item._id === product._id
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
  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== productId),
    );
  };

  //Increase Quantity
  const increaseQuantity = (ProductId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === ProductId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  //descrease quantity
  const decreaseQuantity = (ProductId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === ProductId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
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
