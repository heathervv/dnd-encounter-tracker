import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlayerContext } from "../../context/players/players-context";
import { EXPORT_TYPE, ManageData } from '../../components/manage-data/manage-data';
import './players.css'

const Players = () => {
    const navigate = useNavigate()
    const { players, exportPlayers, importPlayers } = usePlayerContext()

    const handleCreateNew = useCallback(() => {
        navigate('/player/create')
    }, [navigate])

    return (
        <section className="wrapper">
            <div className="header">
                <h1>List of player characters</h1>
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
                <p>No player characters added yet!</p>
            )}
            <hr />
            <ManageData
                onExport={exportPlayers}
                onImport={importPlayers}
                type={EXPORT_TYPE.PLAYERS}
            />
        </section>
    )
}

export default Players
