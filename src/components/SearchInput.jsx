import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./SearchInput.css";

const PLACEHOLDER = "Глобальний пошук...";

const MIN_LENGTH = 2;
const MAX_LENGTH = 80;
const INVALID_CHARS = /[<>\\/{}[\]$%^*#`"';]/g;

export default function SearchInput({ className = "", autoFocus = false, wide }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        function handleKeys(e) {
            if (((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "s" && e.altKey)) && !focused) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        }
        window.addEventListener("keydown", handleKeys);
        return () => window.removeEventListener("keydown", handleKeys);
    }, [focused]);

    function validate(query) {
        if (!query.trim()) return "Введіть запит для пошуку.";
        if (query.trim().length < MIN_LENGTH) return `Мінімум ${MIN_LENGTH} символи.`;
        if (query.trim().length > MAX_LENGTH) return `Максимум ${MAX_LENGTH} символів.`;
        if (INVALID_CHARS.test(query)) return "Запит містить некоректні символи.";
        return "";
    }

    function onSubmit(e) {
        e.preventDefault();
        setError("");
        const val = value.trim();
        const err = validate(val);
        if (err) {
            setError(err);
            return;
        }
        navigate(`/search?query=${encodeURIComponent(val)}&from=${encodeURIComponent(location.pathname)}`);
        setValue("");
        inputRef.current.blur();
    }

    useEffect(() => {
        if (error && value && !validate(value)) setError("");
    }, [value, error]);

    return (
        <form
            className={`search-input-wrapper${wide ? " search-input-wide" : ""} ${className} ${focused ? " focus" : ""}`}
            onSubmit={onSubmit}
            autoComplete="off"
            role="search"
            aria-label="Глобальний пошук"
            style={{ marginBottom: 0, marginRight: "0.5em" }}
        >
            <FaSearch className="search-input-icon" />
            <input
                ref={inputRef}
                type="search"
                className="search-input"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={PLACEHOLDER}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                maxLength={MAX_LENGTH}
                minLength={MIN_LENGTH}
                autoFocus={autoFocus}
                aria-label="Пошуковий запит"
            />
            <span className="search-input-bg-stars" aria-hidden="true">
                <svg
                    className={`search-stars-svg${focused ? " focused" : ""}`}
                    width="38"
                    height="20"
                    viewBox="0 0 38 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M32 10.5 L33 13 L35.5 13.2 L33.75 14.8 L34.2 17.3 L32 16 L29.8 17.3 L30.25 14.8 L28.5 13.2 L31 13 Z"
                        stroke="#B1A9F8"
                        strokeWidth="1.5"
                        fill="none"
                        opacity="0.95"
                    />
                    <path
                        d="M36 6.8 L36.35 7.8 L37.3 7.9 L36.6 8.5 L36.8 9.4 L36 8.95 L35.2 9.4 L35.4 8.5 L34.7 7.9 L35.65 7.8 Z"
                        stroke="#B1A9F8"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.75"
                    />
                    <circle cx="29.7" cy="7.2" r="1" fill="#B1A9F8" opacity="0.6" />
                    <circle cx="34.8" cy="15.2" r="0.55" fill="#B1A9F8" opacity="0.45" />
                    <circle cx="37.2" cy="12.7" r="0.4" fill="#B1A9F8" opacity="0.4" />
                    <circle cx="32.8" cy="6.3" r="0.35" fill="#B1A9F8" opacity="0.55" />
                </svg>
            </span>
            {error && <span className="search-input-error">{error}</span>}
        </form>
    );
}