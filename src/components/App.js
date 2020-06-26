import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GlobalStyles from "../styles/globalStyles";
import Header from "./Header";
import Main from "./Main";
import Room from "./Room";

function App() {
    const [roomName, setRoomName] = useState("");

    return (
        <div className="App">
            <GlobalStyles />
            <Router>
                <Header roomName={roomName} />
                <Switch>
                    <Route path="/room/:roomName">
                        <Room setRoomName={setRoomName} />
                    </Route>
                    <Route path="/">
                        <Main setRoomName={setRoomName} />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
