import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";

console.log(import.meta.env.VITE_BACKEND_URL);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
