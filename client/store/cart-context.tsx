import React, { Dispatch, useEffect, useState, SetStateAction } from "react";
// import ICartContext from "../types/context-interfaces/CartContext.interface";
interface ICartContext {
  refresh: boolean,
  setRefresh: Dispatch<SetStateAction<boolean>>,
}

const CartContext = React.createContext<ICartContext>({refresh: false, setRefresh: () => false});

type Props = {
  children: JSX.Element
}

export const CartProvider = ({ children }: Props): JSX.Element => {
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
