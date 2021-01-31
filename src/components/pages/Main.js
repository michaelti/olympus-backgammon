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

function Main() {
    return (
        <Container>
            <StartForm />
            <div>
                <h1>Olympus Backgammon</h1>
                <p>
                    In Greece, there are three major variants of Backgammon: Portes, Plakoto, and
                    Fevga. When played together, they are called Tavli. Welcome to the ancient game,
                    the Greek way.
                </p>
            </div>
        </Container>
    );
}

export default Main;
