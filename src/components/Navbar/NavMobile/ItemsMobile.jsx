import React from "react";
import { motion } from "framer-motion";
import { planetsList } from "../PlanetsList";
import { Link } from "react-router-dom";
import Icon from "../../Icon";
import "./ItemsMobile.css";

const ItemsMobile = ({ resetMenu }) => (
    <>
        {planetsList.map((planet) => (
            <motion.li
                className="mobile-menu-item"
                key={planet.id}
                initial={{ x: "100vw" }}
                animate={{ x: "0vw" }}
                transition={{
                    ease: [0.06, 0.9, 1, 0.98],
                    duration: 0.7,
                    delay: (planet.id * 5 + 0.5) / 100,
                }}
            >
                <Link
                    to={planet.path}
                    className="mobile-menu-link"
                    aria-label={planet.name}
                    onClick={resetMenu}
                >
                    <span
                        className="mobile-menu-dot"
                        style={{
                            background: planet.color,
                        }}
                    />
                    <span className="mobile-menu-planet-name">{planet.name}</span>
                    <span className="mobile-menu-spacer" />
                    <Icon
                        name="icon-chevron1"
                        size={20}
                        color="#bbb"
                    />
                </Link>
            </motion.li>
        ))}
    </>
);

export default ItemsMobile;