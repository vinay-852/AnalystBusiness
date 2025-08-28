import { createContext, useContext, useState } from "react";

const UserChoicesContext = createContext();

export const UserChoicesProvider = ({ children }) => {
  const [userChoices, setUserChoices] = useState([]);
  return (
    <UserChoicesContext.Provider value={{ userChoices, setUserChoices }}>
      {children}
    </UserChoicesContext.Provider>
  );
};

export const useUserChoices = () => useContext(UserChoicesContext);
