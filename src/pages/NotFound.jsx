import React from "react";
import "./NotFound.css";

const NotFound = () => (
    <div className="dsx-404-root">
        <div className="dsx-404-content">
            <h1 className="dsx-404-glow">404</h1>
            <h2 className="dsx-404-glow">Сторінку не знайдено</h2>
            <p className="dsx-404-desc">
                Ви потрапили в незвіданий сектор Всесвіту.<br />
                Спробуйте повернутись на головну сторінку.
            </p>
            <a href="/cosmic-explorer/" className="dsx-404-btn">На головну</a>
        </div>
    </div>
);

export default NotFound;