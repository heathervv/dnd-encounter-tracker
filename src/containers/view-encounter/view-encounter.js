import { useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEncountersContext } from "../../context/encounters/encounters-context";
import { usePlayerContext } from "../../context/players/players-context";

const Monster = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getSingleEncounter, deleteEncounter } = useEncountersContext()
    const { players } = usePlayerContext()

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
                    {encounter.name}
                    <p>Player characters:</p>
                    <ul>
                        {players.map((player) => (
                            <li key={player.id}>
                                {player.name}
                            </li>
                        ))}
                    </ul>
                    <p>Monsters:</p>
                    Comin' up!
                </>
            ) : (
                <p>Sorry, the requested encounter could not be found.</p>
            )}
        </section>
    )
}

export default Monster
