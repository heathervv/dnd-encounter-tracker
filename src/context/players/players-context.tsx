import {
    createContext,
    useCallback,
    useContext,
} from 'react'

export type PLAYER = {
    id: string
}

interface PlayerContextType {
    players?: PLAYER[]
    savePlayers?: (value: PLAYER[]) => void
}


export const PlayerContext = createContext<PlayerContextType>({})

export const usePlayerContext = () => {
    const { players, savePlayers } = useContext(PlayerContext)

    const getSinglePlayer = useCallback(
        (id) => players?.find((player) => player.id === id),
        [players]
    )

    const createPlayer = useCallback(
        (player) => {
            savePlayers?.([...(players || []), player])
        },
        [players, savePlayers]
    )

    const deletePlayer = useCallback(
        (id) => {
            const updatedList = players?.filter((player) => player.id !== id) || []
            savePlayers?.(updatedList)
        },
        [players, savePlayers]
    )

    const updatePlayer = useCallback(
        (player) => {
            const list = players?.filter((p) => p.id !== player.id) || []
            savePlayers?.([...list, player])
        },
        [players, savePlayers]
    )

    const importPlayers = useCallback(
        (data) => {
            savePlayers?.(data)
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
