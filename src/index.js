import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";

import './index.css';
import { PlayerProvider } from './context/players/players-context'
import { MonstersProvider } from './context/monsters/monsters-context'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="dnd-encounter-tracker">
      <PlayerProvider>
        <MonstersProvider>
          <App />
        </MonstersProvider>
      </PlayerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
