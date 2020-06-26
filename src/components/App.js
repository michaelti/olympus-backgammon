import React, { useState } from "react";
import GlobalStyles from "../styles/globalStyles";
import Header from "./Header";
import Main from "./Main";
import Game from "./Game";

function App() {
    const [roomName, setRoomName] = useState("");

    return (
        <div className="App">
            <GlobalStyles />
            <Header roomName={roomName} />
            <Main setRoomName={setRoomName} />
            <Game />
        </div>
    );
}

export default App;
