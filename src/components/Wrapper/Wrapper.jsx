import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Wrapper.css";

const Wrapper = ({ children }) => {
    return (
        <div className="universe-bg d-flex flex-column min-vh-100 position-relative overflow-hidden">
            {children}
            <span className="stars-overlay" aria-hidden="true"></span>
        </div>
    );
};

export default Wrapper;