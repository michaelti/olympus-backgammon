import styled, { css, keyframes } from "styled-components";

const shakeAnimation = keyframes`
    0% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-10px);
    }

    50% {
        transform: translateX(10px);
    }

    75% {
        transform: translateX(0);
    }
`;

export default styled.input`
    display: block;
    width: 100%;
    padding: 1rem;
    border: none;
    font-size: 2rem;
    text-align: center;
    border-bottom: 2px solid #ccc;
    border-radius: 0;

    &:focus {
        outline: 5px solid #7aadf3;
    }

    ${(p) => p.invalid && InvalidStyles}
`;

const InvalidStyles = css`
    outline: 5px solid #fc494c !important;
    animation: ${shakeAnimation} 0.25s;
`;
