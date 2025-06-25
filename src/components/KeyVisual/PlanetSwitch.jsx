import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PlanetSwitch.css";
import mercuryImg from "../../assets/images/planet-mercury.svg";
import venusImg from "../../assets/images/planet-venus.svg";
import earthImg from "../../assets/images/planet-earth.svg";
import marsImg from "../../assets/images/planet-mars.svg";
import jupiterImg from "../../assets/images/planet-jupiter.svg";
import saturnImg from "../../assets/images/planet-saturn.svg";
import uranusImg from "../../assets/images/planet-uranus.svg";
import neptuneImg from "../../assets/images/planet-neptune.svg";

const planetConfig = {
    Меркурій: { orbitClass: "mercury-orbit", img: mercuryImg, size: 18, orbit: 100, anim: "7.2s" },
    Венера:   { orbitClass: "venus-orbit", img: venusImg, size: 24, orbit: 140, anim: "18.4s" },
    Земля:    { orbitClass: "earth-orbit", img: earthImg, size: 28, orbit: 190, anim: "30s" },
    Марс:     { orbitClass: "mars-orbit", img: marsImg, size: 22, orbit: 240, anim: "56.4s" },
    Юпітер:   { orbitClass: "jupiter-orbit", img: jupiterImg, size: 40, orbit: 330, anim: "355.7s" },
    Сатурн:   { orbitClass: "saturn-orbit", img: saturnImg, size: 38, orbit: 420, anim: "882.7s" },
    Уран:     { orbitClass: "uranus-orbit", img: uranusImg, size: 30, orbit: 510, anim: "2512s" },
    Нептун:   { orbitClass: "neptune-orbit", img: neptuneImg, size: 30, orbit: 600, anim: "4911s" },
};

const PlanetSwitch = ({ data, activePlanet }) => {
    const current = planetConfig[data.name];
    if (!current) return null;

    const isSelected = activePlanet === data.path;

    return (
        <div
            className={`planet-orbit ${current.orbitClass}`}
            style={{
                width: `${current.orbit}px`,
                height: `${current.orbit}px`,
                animationDuration: current.anim,
            }}
        >
            <Link
                to={data.path}
                className={`planet-btn${isSelected ? " planet-active" : ""}`}
                style={{
                    width: `${current.size}px`,
                    height: `${current.size}px`,
                    backgroundImage: `url(${current.img})`,
                    borderColor: isSelected ? data.accent : "rgba(200,200,255,0.18)",
                }}
                tabIndex={0}
                aria-label={data.name}
            />
        </div>
    );
};

export default PlanetSwitch;