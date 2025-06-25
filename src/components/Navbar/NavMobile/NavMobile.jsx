import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavMobile.css";
import ItemsMobile from "./ItemsMobile";
import { useMenu } from "../MenuContext";

const BREAKPOINT_MD = 768;

const NavMobile = ({ windowWidth }) => {
    const { menuVisible, toggleMenu, resetMenu } = useMenu();

    useEffect(() => {
        if (windowWidth >= BREAKPOINT_MD) resetMenu();
        // eslint-disable-next-line
    }, [windowWidth]);

    return (
        <nav className="mobile-nav">
            <button
                className="mobile-nav-toggle d-flex justify-content-center align-items-center"
                aria-label="Відкрити меню"
                aria-expanded={menuVisible}
                aria-controls="planets-mobile-list"
                type="button"
                onClick={toggleMenu}
            >
                <span className={`burger-btn${menuVisible ? " open" : ""}`}>
                    <span />
                </span>
            </button>

            <AnimatePresence>
                {menuVisible && (
                    <motion.ul
                        id="planets-mobile-list"
                        className="mobile-nav-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ ease: "linear", duration: 0.3 }}
                        exit={{ opacity: 0 }}
                    >
                        <ItemsMobile resetMenu={resetMenu} />
                    </motion.ul>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default NavMobile;