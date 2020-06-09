import React from 'react';
import { Player } from '../../util.js';

function Checker({ posX, posY, color, active }) {
    const translateX = posX + 'px';
    const translateY = posY + 'px';
    const transform = `translate( ${translateX}, ${translateY} )`;

    let svg = null;

    if (color === Player.white) {
        svg = (
            <svg width="100" height="100" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="linear-gradient" x1="14.64" y1="14.64" x2="85.36" y2="85.36" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#e6e6e6"/>
                        <stop offset="1" stopColor="#fff" />
                    </linearGradient>
                    <linearGradient id="linear-gradient-2" x1="14.64" y1="85.36" x2="85.36" y2="14.64" href="#linear-gradient"/>
                    <linearGradient id="linear-gradient-3" x1="14.64" y1="14.64" x2="85.36" y2="85.36" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#e6e6e6"/>
                        <stop offset="1" stopColor="#fff"/>
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="50" fill="url(#linear-gradient)"/>
                <path d="M50,25A25,25,0,1,1,25,50,25,25,0,0,1,50,25M50,0a50,50,0,1,0,50,50A50,50,0,0,0,50,0Z" fill="url(#linear-gradient-2)"/>
                <path d="M50,20A30,30,0,1,1,20,50,30,30,0,0,1,50,20M50,0a50,50,0,1,0,50,50A50,50,0,0,0,50,0Z" fill="url(#linear-gradient-3)"/>
            </svg>
        );
    } else if (color === Player.black) {
        svg = (
            <svg width="100" height="100" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="linear-gradient-4" x1="14.64" y1="14.64" x2="85.36" y2="85.36" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#1a1a1a"/>
                        <stop offset="1"/>
                    </linearGradient>
                    <linearGradient id="linear-gradient-5" x1="14.64" y1="85.36" x2="85.36" y2="14.64" href="#linear-gradient-4"/>
                </defs>
                <circle cx="50" cy="50" r="50" fill="url(#linear-gradient-4)"/>
                <path d="M50,25A25,25,0,1,1,25,50,25,25,0,0,1,50,25M50,0a50,50,0,1,0,50,50A50,50,0,0,0,50,0Z" fill="url(#linear-gradient-5)"/>
                <path d="M50,20A30,30,0,1,1,20,50,30,30,0,0,1,50,20M50,0a50,50,0,1,0,50,50A50,50,0,0,0,50,0Z" fill="url(#linear-gradient-4)"/>
            </svg>
        );
    }

    return (
        <g style={{ transform: transform, transition: 'transform 0.15s ease' }}>
            { active ? <circle cx="50" cy="50" r="60" fill="rgb(128, 128, 128)" /> : null }
            { svg }
            
        </g>
    );
}

export default Checker;
