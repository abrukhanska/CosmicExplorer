import React from "react";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import "./PlanetVisual.css";

const PlanetVisual = ({
                          planetData,
                          currentData,
                          isChanging,
                          className = "",
                      }) => {
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.5, rotate: 20, x: 200 },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            x: 0,
            transition: { delay: 1, duration: 1.5 },
        },
        exit: {
            opacity: 0,
            scale: 0.5,
            rotate: -20,
            x: -200,
            transition: { duration: 1 },
        },
    };

    if (!currentData || !currentData.image) {
        return (
            <Container className={className} fluid>
                <div style={{ color: "#fff", padding: "2rem", textAlign: "center" }}>
                    Зображення для цієї вкладки відсутнє
                </div>
            </Container>
        );
    }

    return (
        <Container className={className} fluid>
            <motion.div
                className="visual-outer"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div
                    className={`visual-img mx-auto${isChanging ? " swapping" : ""}`}
                    style={{
                        "--main-img": `url(${currentData.image})`,
                        "--img-mobile": planetData?.mobileImgWidth ?? "184px",
                        "--img-tablet": planetData?.tabletImgWidth ?? "285px",
                        "--img-desktop": planetData?.desktopImgWidth ?? "450px",
                    }}
                    data-has-geo={!!currentData.geo}
                >
                    {currentData.geo && (
                        <div
                            className="geo-drop"
                            style={{
                                backgroundImage: `url(${currentData.geo})`
                            }}
                        />
                    )}
                </div>
            </motion.div>
        </Container>
    );
};

export default PlanetVisual;