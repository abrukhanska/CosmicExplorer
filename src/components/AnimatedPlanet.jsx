import React from "react";
export default function AnimatedPlanet({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
            <defs>
                <radialGradient id="planetMain" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#8bb6fa"/>
                    <stop offset="100%" stopColor="#4e80c9"/>
                </radialGradient>
            </defs>
            <circle cx="12" cy="12" r="11" fill="url(#planetMain)" />
        </svg>
    );
}