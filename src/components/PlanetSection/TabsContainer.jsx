import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TabsContainer.css";

const TabsContainer = ({
                           planetData,
                           handleClick,
                           currentTab,
                           windowWidth,
                       }) => {
    const containerVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { delay: 1.5, duration: 1.5 },
        },
        exit: { opacity: 0, x: 50, transition: { duration: 1 } },
    };

    const tabList = [
        { type: "overview", label: "Огляд" },
        { type: "structure", label: windowWidth >= 768 ? "Внутрішня будова" : "Будова" },
        { type: "geology", label: windowWidth >= 768 ? "Геологія поверхні" : "Поверхня" },
    ];

    return (
        <motion.div
            className="tabs-container"
            role="tablist"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {tabList.map((tab, idx) => (
                <button
                    key={tab.type}
                    type="button"
                    className={`tab-btn${currentTab === tab.type ? " active" : ""}`}
                    role="tab"
                    aria-selected={currentTab === tab.type}
                    aria-controls={`tabpanel-${tab.type}`}
                    tabIndex={currentTab === tab.type ? 0 : -1}
                    data-type={tab.type}
                    onClick={handleClick}
                    style={{
                        pointerEvents: "auto",
                        zIndex: 10,
                        userSelect: "none",
                        position: "relative"
                    }}
                >
                    <span className="tab-btn-num">{idx + 1}</span>
                    <span className="tab-btn-label">{tab.label}</span>
                </button>
            ))}
        </motion.div>
    );
};

export default TabsContainer;