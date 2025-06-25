import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./planet-global.css";

const PlanetThemeProvider = ({ children }) => {
    return <div className="planet-theme-root">{children}</div>;
};

export default PlanetThemeProvider;