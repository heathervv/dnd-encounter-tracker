import { useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePlayerContext } from '../../context/players/players-context'

const Player = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getSinglePlayer, deletePlayer } = usePlayerContext()

    const player = useMemo(() => getSinglePlayer?.(id), [id, getSinglePlayer])

    const handleEdit = useCallback(() => {
        navigate(`/player/${player.id}/edit`)
    }, [player, navigate])

    const handleDelete = useCallback(() => {
        deletePlayer(player.id)
        navigate('/players')
    }, [player, deletePlayer, navigate])

    return (
        <section className="wrapper" data-color-mode="light">
            {player ? (
                <>
                    <div className="header">
                        <h1>{player.name}</h1>
                        <div className="buttons">
                            <button type="button" onClick={handleEdit}>
                                Edit
                            </button>
                            <button
                                type="button"
                                className="delete"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="player-stats">
                        <ul>
                            <li>
                                <p className="bold">Level:</p>
                                <p>{player.level}</p>
                            </li>
                            <li>
                                <p className="bold">AC:</p>
                                <p>{player.armor_class}</p>
                            </li>
                            <li>
                                <p className="bold">Hit points:</p>
                                <p>{player.health}</p>
                            </li>
                            <li>
                                <p className="bold">Initiative bonus:</p>
                                <p>{player.initiative_bonus}</p>
                            </li>
                            <li>
                                <p className="bold">Passive perception:</p>
                                <p>{player.passive_perception}</p>
                            </li>
                            <li>
                                <p className="bold">Speed:</p>
                                <p>{player.speed}</p>
                            </li>
                        </ul>
                    </div>
                </>
            ) : (
                <p>Sorry, the requested player character could not be found.</p>
            )}
        </section>
    )
}

export default Player
