import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, HashRouter } from 'react-router-dom'
import { PlayerProvider } from './context/players/players-context'
import { MonstersProvider } from './context/monsters/monsters-context'
import { EncountersProvider } from './context/encounters/encounters-context'
import App from './App'
import './index.css'

const router = createHashRouter([
    {
        path: '/*',
        element: <App />,
    },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <HashRouter router={router}>
            <PlayerProvider>
                <MonstersProvider>
                    <EncountersProvider>
                        <App />
                    </EncountersProvider>
                </MonstersProvider>
            </PlayerProvider>
        </HashRouter>
    </React.StrictMode>
)
