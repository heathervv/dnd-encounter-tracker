import {
    createContext,
    useCallback,
    useContext,
    useState,
    useEffect,
} from 'react'

export const PlayerContext = createContext([])

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

export const usePlayerContext = () => {
    const { players, savePlayers } = useContext(PlayerContext)

    const getSinglePlayer = useCallback(
        (id) => players.find((player) => player.id === id),
        [players]
    )

    const createPlayer = useCallback(
        (player) => {
            savePlayers([...players, player])
        },
        [players, savePlayers]
    )

    const deletePlayer = useCallback(
        (id) => {
            const updatedList = players.filter((player) => player.id !== id)
            savePlayers(updatedList)
        },
        [players, savePlayers]
    )

    const updatePlayer = useCallback(
        (player) => {
            const list = players.filter((p) => p.id !== player.id)
            savePlayers([...list, player])
        },
        [players, savePlayers]
    )

    const importPlayers = useCallback(
        (data) => {
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
