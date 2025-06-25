import { useState } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PlanetThemeProvider from "../components/Provider/PlanetThemeProvider";
import Wrapper from "../components/Wrapper/Wrapper";
import Navbar from "../components/Navbar/Navbar";
import MercuryPage from "../components/planets/MercuryPage";
import VenusPage from "../components/planets/VenusPage";
import EarthPage from "../components/planets/EarthPage";
import MarsPage from "../components/planets/MarsPage";
import JupiterPage from "../components/planets/JupiterPage";
import SaturnPage from "../components/planets/SaturnPage";
import UranusPage from "../components/planets/UranusPage";
import NeptunePage from "../components/planets/NeptunePage";
import KeyVisual from "../components/KeyVisual/KeyVisual";
import NotFound from "../pages/NotFound";

const PlanetsLayout = ({ activePlanet, setActivePlanet }) => {
    const location = useLocation();
    return (
        <>
            <Navbar
                pathName={location.pathname}
                onHover={setActivePlanet}
                activePlanet={activePlanet}
            />
            <Wrapper>
                <AnimatePresence mode="wait">
                    <Outlet />
                </AnimatePresence>
            </Wrapper>
        </>
    );
};

const PlanetsPage = () => {
    const [activePlanet, setActivePlanet] = useState('/planets');

    return (
        <PlanetThemeProvider>
            <Routes>
                <Route element={
                    <PlanetsLayout
                        activePlanet={activePlanet}
                        setActivePlanet={setActivePlanet}
                    />
                }>
                    <Route index element={<KeyVisual activePlanet={activePlanet} />} />
                    <Route path="mercury" element={<MercuryPage />} />
                    <Route path="venus" element={<VenusPage />} />
                    <Route path="earth" element={<EarthPage />} />
                    <Route path="mars" element={<MarsPage />} />
                    <Route path="jupiter" element={<JupiterPage />} />
                    <Route path="saturn" element={<SaturnPage />} />
                    <Route path="uranus" element={<UranusPage />} />
                    <Route path="neptune" element={<NeptunePage />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </PlanetThemeProvider>
    );
};

export default PlanetsPage;