import { useCallback, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEncountersContext } from "../../context/encounters/encounters-context";
import { usePlayerContext } from "../../context/players/players-context";
import { useMonstersContext } from "../../context/monsters/monsters-context";

const Monster = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getSingleEncounter, deleteEncounter } = useEncountersContext()
    const { players } = usePlayerContext()
    const { monsters } = useMonstersContext()

    const encounter = useMemo(() => getSingleEncounter?.(id), [id, getSingleEncounter])

    const handleEdit = useCallback(() => {
        navigate(`/encounter/${encounter.id}/edit`)
    }, [encounter, navigate])

    const handleDelete = useCallback(() => {
        deleteEncounter(encounter.id)
        navigate('/encounters')
    }, [encounter, deleteEncounter, navigate])

    return (
        <section>
            {encounter ? (
                <>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                    <Link to={`/combat-tracker/${encounter.id}`}>Combat Tracker</Link>
                    {encounter.name}
                    {encounter.description}
                    <p>Player characters:</p>
                    <ul>
                        {players.map((player) => (
                            <li key={player.id}>
                                {player.name}
                            </li>
                        ))}
                    </ul>
                    <p>Monsters:</p>
                    {(encounter.monsters || []).length > 0 ? (
                        <ul>
                            {encounter.monsters.map((monsterId) => {
                                const monster = monsters.find((m) => m.id === monsterId)
                                return (
                                    <li key={monsterId}>{monster.name}</li>
                                )
                            })}
                        </ul>
                    ) : (
                        <p>Encounter currently has no monsters</p>
                    )}
                </>
            ) : (
                <p>Sorry, the requested encounter could not be found.</p>
            )}
        </section>
    )
}

export default Monster
