import {
    createContext,
    useCallback,
    useContext,
} from 'react'
import type { Player } from '../../types/domain'

interface PlayerContextType {
    players: Player[]
    savePlayers: (value: Player[]) => void
}


export const PlayerContext = createContext<PlayerContextType | null>(null)

export const usePlayerContext = () => {
    const context = useContext(PlayerContext)
    if (!context) {
        throw new Error('usePlayerContext must be used within PlayerProvider')
    }
    const { players, savePlayers } = context

    const getSinglePlayer = useCallback(
        (id: string | undefined) => players.find((player) => player.id === id),
        [players]
    )

    const createPlayer = useCallback(
        (player: Player) => {
            savePlayers([...players, player])
        },
        [players, savePlayers]
    )

    const deletePlayer = useCallback(
        (id: string) => {
            const updatedList = players.filter((player) => player.id !== id)
            savePlayers(updatedList)
        },
        [players, savePlayers]
    )

    const updatePlayer = useCallback(
        (player: Player) => {
            const list = players.filter((p) => p.id !== player.id)
            savePlayers([...list, player])
        },
        [players, savePlayers]
    )

    const importPlayers = useCallback(
        (data: Player[]) => {
            savePlayers(data)
        },
        [savePlayers]
    )

    return {
        players,
        getSinglePlayer,
        createPlayer,
        deletePlayer,
        updatePlayer,
        importPlayers,
    }
}
