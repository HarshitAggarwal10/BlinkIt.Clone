import React, { createContext, useReducer } from "react";

export const CartContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const exists = state.items.find((i) => i.product === action.payload.product);
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product === action.payload.product
              ? { ...i, qty: i.qty + action.payload.qty }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE":
      return {
        ...state,
        items: state.items.filter((i) => i.product !== action.payload),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
