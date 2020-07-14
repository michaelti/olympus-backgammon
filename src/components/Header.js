import React from "react";
import { Link } from "react-router-dom";
import { Container, Navbar, NavbarBrand, Nav, NavbarText } from "reactstrap";
import ConnectionStatus from "./ConnectionStatus";

function Header({ roomName }) {
    return (
        <header>
            <Navbar color="light" light expand="xs">
                <Container className="px-sm-3">
                    <NavbarBrand tag={Link} to="/">
                        Olympus Backgammon
                    </NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavbarText>
                            <Link to={"/room/" + roomName} className="mr-3">
                                {roomName}
                            </Link>
                            <ConnectionStatus />
                        </NavbarText>
                    </Nav>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
