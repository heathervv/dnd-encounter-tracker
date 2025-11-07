import {
    useCallback,
    useState,
    useEffect,
} from 'react'
import { PlayerContext } from './players-context'

const STORAGE_KEY = 'players'

export const PlayerProvider = ({ children }) => {
    const [players, setPlayers] = useState([])

    useEffect(() => {
        const savedPlayers = localStorage.getItem(STORAGE_KEY)

        if (savedPlayers) {
            setPlayers(JSON.parse(savedPlayers))
        }
    }, [])

    const savePlayers = useCallback(
        (pl) => {
            const sorted = pl.sort((a, b) => a.name.localeCompare(b.name))
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted))
            setPlayers(sorted)
        },
        [setPlayers]
    )

    return (
        <PlayerContext.Provider
            value={{
                players,
                savePlayers,
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}