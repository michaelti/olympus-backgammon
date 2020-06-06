import React from 'react';
import Checker from './Checker';

function Pip({ size, top, bot, posX, invertY, onClick }) {

    let checkers = Array(size);

    if (checkers.length > 0) {
        checkers.fill(top);
        checkers[0] = bot;
    }

    const squishAmount = checkers.length > 6 ?
        ((checkers.length - 6) * 100 / (checkers.length - 1)) : 0;

    return (
        <g onClick={onClick}>
            <svg x={posX} y={invertY ? '50%' : '0'} width="100" height="600" viewBox="0 0 100 600">
                <polygon points="50 500 100 0 0 0 50 500" fill="#f7d086" style={{ transformOrigin: '50%', transform: invertY ? 'rotate(180deg)' : 'none' }} />
                <rect height="100%" width="100%" fill="transparent"></rect>
            </svg>

            {checkers.map((checker, i) => {
                const posY = i * (100 - squishAmount);
                return (
                    <Checker
                        key={i}
                        posX={posX}
                        posY={invertY ? (1100 - posY) : posY}
                        color={checker}
                    />
                );
            })}
        </g>
    );
}

export default Pip;
