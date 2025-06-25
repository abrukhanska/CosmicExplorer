import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";
import "./CalendarModal.css";

export default function CalendarModal({ show, onHide, date, min, max, onSelect }) {
    const [val, setVal] = useState(date ? new Date(date) : null);
    const [alert, setAlert] = useState("");

    useEffect(() => {
        setVal(date ? new Date(date) : null);
        setAlert("");
    }, [date, show, min, max]);

    function isBeforeMin(d) {
        if (!d || !min) return false;
        const day = new Date(d); day.setHours(0,0,0,0);
        const mind = new Date(min); mind.setHours(0,0,0,0);
        return day < mind;
    }
    function isAfterMax(d) {
        if (!d || !max) return false;
        const day = new Date(d); day.setHours(0,0,0,0);
        const maxd = new Date(max); maxd.setHours(0,0,0,0);
        return day > maxd;
    }

    function handleRawChange(e) {
        const val = e.target.value;
        if (!val) {
            setVal(null);
            setAlert("");
            return;
        }
        const date = new Date(val);
        if (isNaN(date)) return;
        if (isBeforeMin(date)) {
            setVal(null);
            setAlert("Дата не може бути раніше мінімальної!");
        } else if (isAfterMax(date)) {
            setVal(null);
            setAlert("Дата не може бути у майбутньому!");
        } else {
            setVal(date);
            setAlert("");
        }
    }

    function handleChange(date) {
        setVal(date);
        setAlert("");
    }

    function handleOk() {
        if (val && !isBeforeMin(val) && !isAfterMax(val)) {
            onSelect(val.toISOString().slice(0, 10));
        }
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            dialogClassName="calendar-modal"
            backdropClassName="calendar-modal-backdrop"
        >
            <Modal.Header closeButton>
                <Modal.Title className="modal-title">Оберіть дату APOD</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="react-datepicker__input-container calendar-input-with-icon">
                    <DatePicker
                        selected={val}
                        onChange={handleChange}
                        minDate={min ? new Date(min) : undefined}
                        maxDate={max ? new Date(max) : undefined}
                        dateFormat="dd.MM.yyyy"
                        className="cosmic-datepicker"
                        calendarClassName="calendar-modal-datepicker"
                        placeholderText="Оберіть дату"
                        showPopperArrow={false}
                        todayButton="Сьогодні"
                        filterDate={d => !isBeforeMin(d) && !isAfterMax(d)}
                        onChangeRaw={handleRawChange}
                        popperPlacement="bottom-start"
                        popperClassName="calendar-modal-popper"
                        popperProps={{
                            strategy: "fixed",
                            modifiers: [
                                { name: "flip", enabled: true, options: { fallbackPlacements: ["top-start"] } },
                                { name: "preventOverflow", enabled: true, options: { boundary: "viewport", padding: 6 } },
                                { name: "offset", options: { offset: [0, 4] } }
                            ]
                        }}
                        portalTarget={typeof window !== "undefined" ? document.body : undefined}
                        autoComplete="off"
                    />
                    <FiCalendar className="calendar-icon" />
                </div>
                {alert && (
                    <div
                        style={{
                            marginTop: 12,
                            marginBottom: -8,
                            color: "#ff5555",
                            fontWeight: 700,
                            textAlign: "center"
                        }}
                    >
                        {alert}
                    </div>
                )}
            </Modal.Body>
            <div className="calendar-modal-btns">
                <button
                    className="cosmic-btn"
                    style={{ marginRight: 0 }}
                    onClick={handleOk}
                    disabled={!val || isBeforeMin(val) || isAfterMax(val)}
                >OK</button>
                <button
                    className="cosmic-btn cosmic-btn--secondary"
                    onClick={onHide}
                >Відміна</button>
            </div>
        </Modal>
    );
}