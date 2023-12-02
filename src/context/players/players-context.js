import { createContext, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'
import basePlayers from './players-data'

export const PlayerContext = createContext([])

export const PlayerProvider = ({ children }) => {
    const players = basePlayers.map((player) => ({
        ...player,
        id: uuidv4()
    }))

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