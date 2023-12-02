import { createContext, useContext } from 'react'
import basePlayers from './players-data'

export const PlayerContext = createContext([])

export const PlayerProvider = ({ children }) => {
    const players = basePlayers

    return (
        <PlayerContext.Provider value={{
            players,
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayerContext = () => {
    const { players } = useContext(PlayerContext)

    return { players }
}