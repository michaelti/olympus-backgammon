import React from "react";
import StartForm from "../StartForm";
import styled from "styled-components";

const Container = styled.main`
    background-image: linear-gradient(-30deg, #ddd, #fff);
    background-position: center;
    min-height: 100vh;
    padding: 1rem;
    display: grid;
    justify-content: center;
    align-content: center;
    align-items: center;
    gap: 2rem;

    @media (min-width: 40rem) {
        grid-template-columns: fit-content(12rem) fit-content(32rem);
    }
`;

const H1 = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    color: #745138;

    small {
        font-size: 0.5em;
        font-weight: inherit;
        border-left: 2px solid #ccc;
        padding-left: 0.25em;
        vertical-align: middle;
    }
`;

const Aside = styled.aside`
    position: absolute;
    top: 0;
    right: 0;
    color: #585858;
    padding: 1rem;

    a {
        color: #585858;
        text-decoration: none;
        transition: color 0.15s;

        &:hover {
            color: #000;
        }
    }
`;

function Main() {
    return (
        <Container>
            <StartForm />
            <div>
                <H1>
                    Olympus Backgammon&nbsp;<small>Τάβλι</small>
                </H1>
                <p>
                    Portes, Plakoto, and Fevga. When played together, they're called Tavli. Welcome
                    to the ancient board game, the Greek way.
                </p>
            </div>
            <Aside>
                <a
                    href="https://github.com/michaelti/olympus-backgammon-frontend"
                    target="_blank"
                    rel="noopener noreferrer">
                    <svg role="img" viewBox="0 0 24 24" width="24" fill="currentColor">
                        <title>GitHub</title>
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                </a>
            </Aside>
        </Container>
    );
}

export default Main;
