import React from "react";
import { Container, Navbar, NavbarBrand, Nav, NavbarText } from "reactstrap";

function Header({ roomName, isConnected, isConnecting }) {
    return (
        <header>
            <Navbar color="light" light expand="xs">
                <Container className="px-sm-3">
                    <NavbarBrand>Olympus Backgammon</NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavbarText className="mr-3">
                            Status:{" "}
                            {isConnecting
                                ? "Connecting"
                                : isConnected
                                ? "Connected"
                                : "Disconnected"}
                        </NavbarText>
                        <NavbarText>Room name: {roomName}</NavbarText>
                    </Nav>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
