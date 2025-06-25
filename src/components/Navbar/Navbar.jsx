import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import NavMobile from "./NavMobile/NavMobile";
import NavDesktop from "./NavDesktop/NavDesktop";

const Navbar = ({ pathName, activePlanet, onHover }) => {
    const [screenWidth, setScreenWidth] = React.useState(
        typeof window !== "undefined" ? window.innerWidth : 1024
    );
    const TABLET_WIDTH = 768;

    React.useEffect(() => {
        if (typeof window === "undefined") return;
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const anim = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { delay: 1.5, duration: 4 } },
        exit: { opacity: 0, transition: { duration: 1 } },
    };

    return (
        <motion.header
            className="planet-nav-header border-bottom"
            variants={anim}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="planet-nav-container d-flex justify-content-between align-items-center flex-md-column flex-lg-row mx-auto">
                <h1 className="planet-nav-logo m-0">
                    <Link
                        to="/planets"
                        className="planet-nav-logo-link text-uppercase d-inline-block"
                        tabIndex={0}
                    >
                        Планети
                    </Link>
                </h1>
                {typeof screenWidth !== "number" || isNaN(screenWidth) ? (
                    <span style={{ color: "red" }}>Width error!</span>
                ) : screenWidth >= TABLET_WIDTH ? (
                    <NavDesktop
                        pathName={pathName}
                        onHover={onHover}
                        activePlanet={activePlanet}
                    />
                ) : (
                    <NavMobile windowWidth={screenWidth} />
                )}
            </div>
        </motion.header>
    );
};

export default Navbar;