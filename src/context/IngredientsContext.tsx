import React, { createContext, useContext, useState } from 'react';

const IngredientsContext = createContext('');

export function IngredientsContextProvider({ children }:any) {
  const [ingredients, setIngredients] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <IngredientsContext.Provider value={{ ingredients, setIngredients, modalOpen, setModalOpen } as any}>
      {children}
    </IngredientsContext.Provider>
  );
}

export function useIngredientsContext() {
  return useContext(IngredientsContext);
}