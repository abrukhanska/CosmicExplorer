import React, { useContext, useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SearchInput from "./SearchInput";
import AnimatedPlanet from "./AnimatedPlanet";
import { FaUserAstronaut, FaSignOutAlt, FaJournalWhills } from "react-icons/fa";
import { CosmicBurgerIcon } from "./CosmicBurgerIcon";
import { CosmicCloseIcon } from "./CosmicCloseIcon";
import "./Header.css";

export default function Header() {
    const { user, logout, loading: authLoading } = useContext(AuthContext);
    const location = useLocation();
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    useEffect(() => { setShowOffcanvas(false); }, [location.pathname]);
    useEffect(() => {
        const closeOnResize = () => {
            if (window.innerWidth >= 1350) setShowOffcanvas(false);
        };
        window.addEventListener("resize", closeOnResize);
        return () => window.removeEventListener("resize", closeOnResize);
    }, []);

    const navLinks = [
        { to: "/", label: "Ілюмінатор", exact: true },
        { to: "/gallery", label: "Архів Марса" },
        { to: "/station", label: "Орбітальна станція" },
        { to: "/planets", label: "Довідник" },
        { to: "/quiz", label: "Вікторина" },
    ];

    return (
        <header className="cosmic-navbar-shadow">
            <Navbar
                bg="dark"
                expand="xxl"
                variant="dark"
                className="cosmic-navbar"
                expanded={showOffcanvas}
                onToggle={setShowOffcanvas}
            >
                <Container fluid className="cosmic-navbar-inner">
                    <Navbar.Brand as={Link} to="/" className="cosmic-navbar-logo d-flex align-items-center">
                        <AnimatedPlanet size={24} />
                        <span className="cosmic-navbar-logo-text ms-2">Cosmic Explorer</span>
                    </Navbar.Brand>
                    <span
                        className="d-xxl-none cosmic-burger-btn"
                        onClick={() => setShowOffcanvas(true)}
                        role="button"
                        tabIndex={0}
                        aria-label="Відкрити меню"
                    >
                        <CosmicBurgerIcon size={38} />
                    </span>
                    <Navbar.Offcanvas
                        id="cosmic-navbar-offcanvas"
                        aria-labelledby="cosmic-navbar-label"
                        placement="start"
                        show={showOffcanvas}
                        onHide={() => setShowOffcanvas(false)}
                        className="cosmic-navbar-offcanvas d-xxl-none"
                    >
                        <div className="cosmic-offcanvas-header-fake">
                            <button
                                className="cosmic-close-btn"
                                onClick={() => setShowOffcanvas(false)}
                                aria-label="Закрити меню"
                            >
                                <CosmicCloseIcon size={38} />
                            </button>
                        </div>
                        <Offcanvas.Header>
                            <Offcanvas.Title id="cosmic-navbar-label">
                                <AnimatedPlanet size={18} />
                                <span className="cosmic-navbar-logo-text ms-2">Cosmic Explorer</span>
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="flex-column cosmic-navbar-nav-mobile mb-3">
                                {navLinks.map(link => (
                                    <Nav.Link
                                        as={NavLink}
                                        to={link.to}
                                        key={link.to}
                                        end={link.exact}
                                        className="cosmic-navbar-link"
                                        onClick={() => setShowOffcanvas(false)}
                                    >
                                        {link.label}
                                    </Nav.Link>
                                ))}
                            </Nav>
                            <div className="mt-3 mb-3">
                                <SearchInput wide />
                            </div>
                            {!authLoading && !user && (
                                <Button
                                    as={Link}
                                    to="/auth"
                                    className="cosmic-navbar-btn cosmic-navbar-btn-glow w-100"
                                    variant="primary"
                                    onClick={() => setShowOffcanvas(false)}
                                >
                                    <span className="cosmic-navbar-btn-icon">
                                        <FaUserAstronaut />
                                    </span>
                                    <span className="cosmic-navbar-btn-text">
                                        Вхід | Реєстрація
                                    </span>
                                </Button>
                            )}
                            {!authLoading && user && (
                                <div className="cosmic-navbar-actions-mobile">
                                    <Button
                                        as={Link}
                                        to="/journal"
                                        className="cosmic-navbar-btn cosmic-navbar-btn-glow"
                                        variant="primary"
                                        onClick={() => setShowOffcanvas(false)}
                                    >
                                        <span className="cosmic-navbar-btn-icon">
                                            <FaJournalWhills />
                                        </span>
                                        <span className="cosmic-navbar-btn-text">
                                            Мій Журнал
                                        </span>
                                    </Button>
                                    <Button
                                        className="cosmic-navbar-btn cosmic-navbar-btn-circle"
                                        variant="primary"
                                        aria-label="Вийти"
                                        onClick={() => {
                                            logout();
                                            setShowOffcanvas(false);
                                        }}
                                    >
                                        <span className="cosmic-navbar-btn-icon">
                                            <FaSignOutAlt />
                                        </span>
                                    </Button>
                                </div>
                            )}
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                    <Navbar.Collapse id="main-navbar" className="justify-content-end d-none d-xxl-flex">
                        <Nav className="flex-grow-1 flex-nowrap cosmic-navbar-nav">
                            {navLinks.map(link => (
                                <Nav.Link
                                    as={NavLink}
                                    to={link.to}
                                    key={link.to}
                                    end={link.exact}
                                    className="cosmic-navbar-link"
                                >
                                    {link.label}
                                </Nav.Link>
                            ))}
                        </Nav>
                        <div className="cosmic-navbar-actions">
                            <SearchInput wide />
                            {!authLoading && !user && (
                                <Button
                                    as={Link}
                                    to="/auth"
                                    className="cosmic-navbar-btn cosmic-navbar-btn-glow"
                                    variant="primary"
                                >
                                    <span className="cosmic-navbar-btn-icon">
                                        <FaUserAstronaut />
                                    </span>
                                    <span className="cosmic-navbar-btn-text">
                                        Вхід | Реєстрація
                                    </span>
                                </Button>
                            )}
                            {!authLoading && user && (
                                <>
                                    <Button
                                        as={Link}
                                        to="/journal"
                                        className="cosmic-navbar-btn cosmic-navbar-btn-glow"
                                        variant="primary"
                                    >
                                        <span className="cosmic-navbar-btn-icon">
                                            <FaJournalWhills />
                                        </span>
                                        <span className="cosmic-navbar-btn-text">
                                            Мій Журнал
                                        </span>
                                    </Button>
                                    <Button
                                        className="cosmic-navbar-btn cosmic-navbar-btn-circle"
                                        variant="primary"
                                        aria-label="Вийти"
                                        onClick={logout}
                                    >
                                        <span className="cosmic-navbar-btn-icon">
                                            <FaSignOutAlt />
                                        </span>
                                    </Button>
                                </>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}