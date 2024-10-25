import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlayerContext } from "../../context/players/players-context";
import './players.css'

const Players = () => {
    const navigate = useNavigate()
    const { players } = usePlayerContext()

    const handleCreateNew = useCallback(() => {
        navigate('/player/create')
    }, [navigate])

    return (
        <section className="wrapper">
            <div className="header">
                <div>
                    <h1>List of player characters</h1>
                    <p>Manage your tables PCs.</p>
                </div>
                <button onClick={handleCreateNew}>Create new</button>
            </div>
            {players.length > 0 ? (
                <ul className="player-list">
                    {players.map((player) => (
                        <li key={player.id}>
                            <Link to={`/player/${player.id}`}>
                                <div className="player-link">
                                    <p className="player-name">{player.name}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="empty">You have not created any player characters yet.</p>
            )}
        </section>
    )
}

export default Players
