import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
export default function ApodDrawer({ onClose, children }) {
    return (
        <div className="apod-drawer apod-drawer--right">
            <div className="apod-drawer-content">
                {children}
            </div>
            <button
                className="apod-drawer-hidebtn"
                aria-label="Сховати опис"
                onClick={onClose}
                type="button"
            >
                <MdKeyboardArrowRight size={38} />
            </button>
        </div>
    );
}