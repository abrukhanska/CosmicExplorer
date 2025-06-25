import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import IlluminatorPage from "./pages/IlluminatorPage";
import MarsGallery from "./pages/MarsGallery";
import Journal from "./pages/Journal";
import ISS from "./pages/ISS";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import PlanetsPage from "./pages/PlanetsPage";
import { MenuProvider } from "./components/Navbar/MenuContext";
import SearchPage from "./pages/Search";
import "./App.css";

function App() {
    return (
        <AuthProvider>
            <MenuProvider>
                <Header />
                <main className="cosmic-app-main-content">
                    <Routes>
                        <Route path="/" element={<IlluminatorPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/gallery" element={<MarsGallery />} />
                        <Route path="/journal" element={<Journal />} />
                        <Route path="/station" element={<ISS />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/planets/*" element={<PlanetsPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </MenuProvider>
        </AuthProvider>
    );
}

export default App;