import { useState, useEffect } from "react";
import TabsContainer from "./TabsContainer";
import InfoContainer from "./InfoContainer";
import PlanetVisual from "./PlanetVisual";
import IntroContainer from "./IntroContainer";
import useDataSwap from "./UseDateSwap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PlanetSection.css";

const PlanetSection = ({ planetData }) => {
    const [handleClick, currentData, currentTab, isChanging] = useDataSwap(planetData);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <section className="planet-section">
            <div className="planet-grid">
                <div className="illustration-area">
                    <PlanetVisual
                        planetData={planetData}
                        currentData={currentData}
                        isChanging={isChanging}
                    />
                </div>
                <div className="intro-area">
                    <IntroContainer
                        planetData={planetData}
                        currentData={currentData}
                        isChanging={isChanging}
                    />
                </div>
                <div className="tabs-area">
                    <TabsContainer
                        planetData={planetData}
                        handleClick={handleClick}
                        currentTab={currentTab}
                        windowWidth={windowWidth}
                    />
                </div>
                <div className="info-area">
                    <InfoContainer planetData={planetData} />
                </div>
            </div>
        </section>
    );
};
export default PlanetSection;