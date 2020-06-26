import React from "react";
import { Link } from "react-router-dom";
import { Container, Navbar, NavbarBrand, Nav, NavbarText } from "reactstrap";
import { useSocketStatus } from "../api";

function Header({ roomName }) {
    const [isConnected, isConnecting] = useSocketStatus();

    return (
        <header>
            <Navbar color="light" light expand="xs">
                <Container className="px-sm-3">
                    <NavbarBrand tag={Link} to="/">
                        Olympus Backgammon
                    </NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavbarText className="mr-3">
                            Status:{" "}
                            {isConnecting
                                ? "Connecting"
                                : isConnected
                                ? "Connected"
                                : "Disconnected"}
                        </NavbarText>
                        <NavbarText>
                            Room name: <Link to={"/room/" + roomName}>{roomName}</Link>
                        </NavbarText>
                    </Nav>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
