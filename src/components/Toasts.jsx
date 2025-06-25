import React, { useEffect } from "react";
import styles from "./Toasts.module.css";

export default function Toasts({ messages, onClose }) {
    useEffect(() => {
        if (!messages.length) return;
        const timers = messages.map((_, idx) =>
            setTimeout(() => onClose(idx), 2100 + idx * 180)
        );
        return () => timers.forEach(clearTimeout);
    }, [messages, onClose]);

    return (
        <div className={styles.toastContainer} aria-live="polite">
            {messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={`${styles.toast} ${styles["toast-" + (msg.variant || "info")]}`}
                    role="alert"
                >
                    {msg.text}
                </div>
            ))}
        </div>
    );
}