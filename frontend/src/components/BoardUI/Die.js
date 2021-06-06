import React from "react";
import styled from "styled-components";

const Svg = styled.svg`
    height: 100%;
    width: auto;
    opacity: ${({ used }) => (used ? "0.5" : "1")};
    transition: opacity 0.15s;
`;

function Die({ number, used }) {
    const diceSVGs = {
        1: (
            <g>
                <circle cx="278" cy="278" r="70" />
            </g>
        ),
        2: (
            <g>
                <circle cx="440" cy="440" r="70" />
                <circle cx="117" cy="117" r="70" />
            </g>
        ),
        3: (
            <g>
                <circle cx="440" cy="440" r="70" />
                <circle cx="117" cy="117" r="70" />
                <circle cx="278.5" cy="278.5" r="70" />
            </g>
        ),
        4: (
            <g>
                <circle cx="440" cy="440" r="70" />
                <circle cx="117" cy="117" r="70" />
                <circle cx="117" cy="440" r="70" />
                <circle cx="440" cy="117" r="70" />
            </g>
        ),
        5: (
            <g>
                <circle cx="440" cy="440" r="70" />
                <circle cx="117" cy="117" r="70" />
                <circle cx="117" cy="440" r="70" />
                <circle cx="440" cy="117" r="70" />
                <circle cx="278.5" cy="278.5" r="70" />
            </g>
        ),
        6: (
            <g>
                <circle cx="440" cy="440" r="70" />
                <circle cx="117" cy="117" r="70" />
                <circle cx="117" cy="440" r="70" />
                <circle cx="440" cy="117" r="70" />
                <circle cx="117" cy="278.5" r="70" />
                <circle cx="440" cy="278.5" r="70" />
            </g>
        ),
    };

    return (
        <Svg viewBox="0 0 557 557" used={used}>
            <rect x="0" y="0" rx="70" ry="70" width="557" height="557" fill="#fff" />
            <title>{number}</title>
            {diceSVGs[number]}
        </Svg>
    );
}

export default Die;
