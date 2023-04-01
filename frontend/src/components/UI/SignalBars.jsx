import React from "react";
import styled, { css, keyframes } from "styled-components";

const connectingAnimation = keyframes`
      from { opacity: 1 }
      to { opacity: 0 }
`;

const animationMixin = css`
    animation: ${connectingAnimation} 900ms ease-in infinite alternate;
    &:nth-child(2) {
        animation-delay: 200ms;
    }
    &:nth-child(3) {
        animation-delay: 400ms;
    }
`;

const BarsSVG = styled.svg`
    height: 0.875em;
    vertical-align: baseline;
    fill: rgba(0, 0, 0, 0.25);

    > rect {
        ${({ animate }) => (animate ? animationMixin : null)}

        &:nth-child(-n + ${({ strength }) => strength}) {
            fill: ${({ strength }) => {
                if (strength === 1) return "red";
                else if (strength === 2) return "orange";
                else if (strength === 3) return "green";
            }};
        }
    }
`;

function SignalBars({ id, strength, animate }) {
    return (
        <BarsSVG viewBox="0 0 100 100" id={id} strength={strength} animate={animate}>
            <rect x="0" y="67%" width="25%" height="33%" />
            <rect x="37.5%" y="33%" width="25%" height="67%" />
            <rect x="75%" y="0" width="25%" height="100%" />
        </BarsSVG>
    );
}

export default SignalBars;
