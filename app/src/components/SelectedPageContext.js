import { createContext, useContext, useState } from "react";

const SelectedPageContext = createContext();

export const SelectedPageProvider = ({ children }) => {
  const [selectedPage, setSelectedPage] = useState(null);

  return (
    <SelectedPageContext.Provider value={{ selectedPage, setSelectedPage }}>
      {children}
    </SelectedPageContext.Provider>
  );
};

export const useSelectedPage = () => useContext(SelectedPageContext);
