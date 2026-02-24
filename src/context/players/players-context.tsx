import {
    createContext,
    useCallback,
    useContext,
} from 'react'
import type { Player } from '../../types/domain'

export type PLAYER = Player

interface PlayerContextType {
    players: PLAYER[]
    savePlayers: (value: PLAYER[]) => void
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
        (player: PLAYER) => {
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
        (player: PLAYER) => {
            const list = players.filter((p) => p.id !== player.id)
            savePlayers([...list, player])
        },
        [players, savePlayers]
    )

    const importPlayers = useCallback(
        (data: PLAYER[]) => {
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
