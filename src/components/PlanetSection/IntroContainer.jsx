import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./IntroContainer.css";
import Icon from "../Icon";

const IntroContainer = ({ planetData, currentData, isChanging }) => {
    const containerVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { delay: 1.5, duration: 1.5 },
        },
        exit: { opacity: 0, x: 50, transition: { duration: 1 } },
    };

    if (!currentData || (!currentData.content && !currentData.source)) {
        return (
            <motion.div
                className="intro-container d-flex flex-column align-items-center px-3 mb-4 mb-md-0"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ color: "#fff", fontSize: "1.2rem", padding: "2rem" }}
            >
                Дані для цієї вкладки відсутні
            </motion.div>
        );
    }

    return (
        <motion.div
            className="intro-container d-flex flex-column align-items-center px-3 mb-4 mb-md-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <h1 className="intro-title mb-3 mb-md-4 mb-lg-5">{planetData.name}</h1>
            {currentData.content && (
                <p
                    className={`intro-text mb-2 mb-md-4 mb-lg-3 ${isChanging ? "text-swapping" : ""}`}
                    aria-live="assertive"
                >
                    {currentData.content}
                </p>
            )}
            {currentData.source && (
                <div className="intro-source d-flex align-items-center gap-1">
                    <span className="intro-source-label">Джерело: </span>
                    <a
                        className="intro-source-link d-flex align-items-center gap-1"
                        href={currentData.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: "#fff",
                            '--section-color': planetData.sectionColor || planetData.color || "hsl(240, 67%, 62%)"
                        }}
                    >
                        Wikipedia
                        <Icon name="source" size={14} color="hsl(240, 6%, 54%)" />
                    </a>
                </div>
            )}
        </motion.div>
    );
};

export default IntroContainer;