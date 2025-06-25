import React, { createContext, useContext, useState } from "react";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const resetMenu = () => setMenuVisible(false);
    const toggleMenu = () => setMenuVisible((prev) => !prev);

    return (
        <MenuContext.Provider value={{ menuVisible, toggleMenu, resetMenu }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => useContext(MenuContext);