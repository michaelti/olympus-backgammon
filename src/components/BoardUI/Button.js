import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    position: relative;
    height: 100%;
    padding: 0 1em;
    font: inherit;
    border: none;
    cursor: pointer;
    background-color: #f1d190;
    color: #212121;
    transition: background-color 0.15s;
    touch-action: manipulation;

    &:hover,
    &:active,
    &:focus {
        background-color: #fff;

        ::after {
            opacity: 1;
        }
    }

    &:disabled {
        background-color: #f1d190;
        pointer-events: none;
        opacity: 0.5;

        ::after {
            opacity: 0;
        }
    }

    &::after {
        content: attr(aria-label);
        position: absolute;
        bottom: calc(100% + 5px);
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;
        background-color: #212121;
        color: #fff;
        font-weight: normal;
        font-size: 90%;
        padding: 0 0.5em;
        border-radius: 5px;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.15s;
    }
`;

function Button({ label, children, ...props }) {
    return (
        <StyledButton aria-label={label} {...props}>
            {children}
        </StyledButton>
    );
}

export default Button;
