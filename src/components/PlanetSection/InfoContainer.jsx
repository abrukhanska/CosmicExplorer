import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./InfoContainer.css";

const INFO_LABELS = [
    { key: "rotation", label: "Період обертання" },
    { key: "revolution", label: "Період навколо Сонця" },
    { key: "radius", label: "Радіус" },
    { key: "temperature", label: "Середня t°" }
];

const InfoContainer = ({ planetData }) => {
    const getValue = (val) => (val ? val : "—");

    const containerVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delay: 1.5, duration: 1.5 },
        },
        exit: { opacity: 0, y: 25, transition: { duration: 1 } },
    };

    return (
        <motion.ul
            className="info-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {INFO_LABELS.map(({ key, label }) => (
                <li key={key} className="info-item">
                    <span className="info-heading">{label}</span>
                    <span className="info-desc">{getValue(planetData?.[key])}</span>
                </li>
            ))}
        </motion.ul>
    );
};

export default InfoContainer;