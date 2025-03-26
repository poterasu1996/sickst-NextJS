import React, { useEffect, useState } from "react";
interface ICartContext {
  refreshContext: () => void
}

const CartContext = React.createContext<ICartContext>({ refreshContext: () => {}});

type Props = {
  children: JSX.Element
}

export const CartProvider = ({ children }: Props): JSX.Element => {
  const [refresh, setRefresh] = useState(0);                         // reset cart each time add/delete action is made
  
  useEffect(() => {
    // refresh the context
  }, [refresh])

  const refreshContext = () => {
    setRefresh(prevState => prevState + 1);
  }

  const cartManager: ICartContext = {
    refreshContext: refreshContext
  };

  return (
    <CartContext.Provider value={cartManager}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
