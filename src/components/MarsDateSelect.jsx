import React from "react";
import "./MarsDateSelect.css";

function formatDate(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}.${m}.${y}`;
}

export default function MarsDateSelect({ availableDates, selectedDate, onSelect, className = "" }) {
    const datesArr = Array.from(availableDates);
    const showValue = selectedDate && !datesArr.includes(selectedDate);

    return (
        <select
            id="mars-date-select"
            className={`mars-gallery-bar-input ${className}`}
            value={selectedDate}
            onChange={e => onSelect(e.target.value)}
        >
            <option value="">Всі дати</option>
            {showValue && <option value={selectedDate}>{formatDate(selectedDate)}</option>}
            {datesArr.map(date => (
                <option key={date} value={date}>
                    {formatDate(date)}
                </option>
            ))}
        </select>
    );
}