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
        cursor: not-allowed;
        ::before {
            opacity: 1;
        }
    }

    /* Disabled overlay */
    &::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.33);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.15s;
    }

    &::after {
        content: attr(aria-label);
        position: absolute;
        bottom: calc(100% + 10px);
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
