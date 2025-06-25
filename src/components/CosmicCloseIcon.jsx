import React from "react";

export function CosmicCloseIcon({ size = 34 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 34 34" fill="none">
            <rect x="2" y="2" width="30" height="30" rx="10" fill="#23233b" stroke="#20e3b2" strokeWidth="2"/>
            <g filter="url(#neon)">
                <rect x="9" y="16" width="16" height="2.7" rx="1.35" fill="#5a97f8" transform="rotate(45 17 17)" />
                <rect x="9" y="16" width="16" height="2.7" rx="1.35" fill="#20e3b2" transform="rotate(-45 17 17)" />
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