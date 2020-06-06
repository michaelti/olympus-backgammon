import React from 'react';
import Checker from './Checker';

function Bar({ count, color, posX, invertY }) {
    const checkers = Array(count).fill(color);

    const squishAmount = checkers.length > 6 ?
        ((checkers.length - 6) * 100 / (checkers.length - 1)) : 0;

    return (
        <g>
            <svg x={posX} y={invertY ? '50%' : '0'} width="100" height="600" viewBox="0 0 100 600">
                <rect width="100" height="600" fill="#745138" />
            </svg>

            {checkers.map((checker, i) => {
                const posY = 500 - (i * (100 - squishAmount));
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

export default Bar;
