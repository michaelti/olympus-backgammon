import styled, { css } from "styled-components";

export default styled.button`
    display: block;
    width: 100%;
    border: none;
    padding: 1rem;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, background-size 0.15s;
    position: relative;

    ${(p) => !p.color && PrimaryStyles}
    ${(p) => p.color === "primary" && PrimaryStyles}
    ${(p) => p.color === "secondary" && SecondaryStyles}


    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    &:focus {
        outline: 5px solid #7aadf3;
    }
`;

const PrimaryStyles = css`
    background: linear-gradient(-30deg, #ddd, #fff);
    color: inherit;
    border: 2px solid #ccc;
`;

const SecondaryStyles = css`
    background: linear-gradient(-30deg, #000, #333);
    color: #fff;
`;
