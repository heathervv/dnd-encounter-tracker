import {
    useCallback,
    useState,
    useEffect,
} from 'react'
import { PlayerContext } from './players-context'
import type { PLAYER } from './players-context'

const STORAGE_KEY = 'players'

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const [players, setPlayers] = useState<PLAYER[]>([])

    useEffect(() => {
        const savedPlayers = localStorage.getItem(STORAGE_KEY)

        if (savedPlayers) {
            setPlayers(JSON.parse(savedPlayers) as PLAYER[])
        }
    }, [])

    const savePlayers = useCallback(
        (pl: PLAYER[]) => {
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
