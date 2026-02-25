import {
    useCallback,
    useState,
    useEffect,
} from 'react'
import { PlayerContext } from './players-context'
import type { Player } from '../../types/domain'

const STORAGE_KEY = 'players'

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const [players, setPlayers] = useState<Player[]>([])

    useEffect(() => {
        const savedPlayers = localStorage.getItem(STORAGE_KEY)

        if (savedPlayers) {
            setPlayers(JSON.parse(savedPlayers) as Player[])
        }
    }, [])

    const savePlayers = useCallback(
        (pl: Player[]) => {
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
