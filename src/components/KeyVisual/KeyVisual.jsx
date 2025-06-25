import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./KeyVisual.css";
import { planetsList } from "../Navbar/PlanetsList";
import PlanetSwitch from "./PlanetSwitch";

const KeyVisual = ({ activePlanet }) => {
    const animationStates = {
        start: {
            opacity: 0,
            transform: "scale(1.6) rotate(-38deg)",
        },
        show: {
            opacity: 1,
            transform: "scale(1) rotate(0deg)",
            transition: { delay: 0.5, duration: 1.5 },
        },
        leave: {
            opacity: 0,
            transform: "scale(0.95) rotate(-12deg)",
            transition: { duration: 1 },
        },
    };

    return (
        <motion.section
            className="solar-bg position-relative min-vh-100 w-100"
            variants={animationStates}
            initial="start"
            animate="show"
            exit="leave"
        >
            <div className="sun-core" />
            {planetsList.map((planet) => (
                <PlanetSwitch
                    data={planet}
                    key={planet.id}
                    activePlanet={activePlanet}
                />
            ))}
            <div className="asteroid-belt" />
        </motion.section>
    );
};

export default KeyVisual;