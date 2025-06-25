import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavDesktop.css";
import { planetsList } from "../PlanetsList";

const NavDesktop = ({ pathName, activePlanet, onHover }) => {
    return (
        <nav className="planet-desktop-nav h-100" aria-label="Навігація по планетах">
            <ul className="planet-desktop-list d-flex flex-row gap-4 w-100 mt-4 mt-lg-0 h-100">
                {planetsList.map((planet) => {
                    const isActive = planet.path === pathName || planet.path === activePlanet;
                    return (
                        <li key={planet.id} className="planet-desktop-item">
                            <NavLink
                                to={planet.path}
                                className={`planet-desktop-link d-flex align-items-center text-uppercase fw-semibold`}
                                data-bg={planet.accent}
                                data-active={isActive ? "true" : "false"}
                                onMouseOver={() => onHover(planet.path)}
                                onMouseLeave={() => onHover(false)}
                                onFocus={() => onHover(planet.path)}
                                onBlur={() => onHover(false)}
                                tabIndex={0}
                            >
                                {planet.name}
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default NavDesktop;