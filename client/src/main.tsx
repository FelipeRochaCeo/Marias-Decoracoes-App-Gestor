import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { disableViteHMR } from "./lib/disableViteHMR";

// Desativa as conexões WebSocket do Vite que estão causando erros
disableViteHMR();

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found. Check if the index.html has a div with id 'root'");
}
