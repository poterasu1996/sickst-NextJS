import React, { useEffect, useState } from "react";
import ICartContext from "../types/context-interfaces/CartContext.interface";

const CartContext = React.createContext<ICartContext | null>(null);

type Props = {
  children: JSX.Element
}

export const CartProvider = ({ children }: Props) => {
  const [refresh, setRefresh] = useState<boolean>(false);                         // reset cart each time add/delete action is made

  const cartManager: ICartContext = {
    refresh: refresh,
    setRefresh: setRefresh,
  };

  return (
    <CartContext.Provider value={cartManager}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
