import React from "react";

export function CosmicBurgerIcon({ size = 34 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 34 34" fill="none">
            <rect x="2" y="2" width="30" height="30" rx="10" fill="#23233b" stroke="#20e3b2" strokeWidth="2"/>
            <g filter="url(#neon)">
                <rect x="8" y="11" width="18" height="2.3" rx="1.15" fill="#20e3b2"/>
                <rect x="8" y="16" width="18" height="2.3" rx="1.15" fill="#5a97f8"/>
                <rect x="8" y="21" width="18" height="2.3" rx="1.15" fill="#20e3b2"/>
            </g>
            <defs>
                <filter id="neon" x="0" y="0" width="34" height="34" filterUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="1.5" result="blur"/>
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
        </svg>
    );
}