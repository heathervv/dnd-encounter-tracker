import { useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMonstersContext } from "../../context/monsters/monsters-context";
import MonsterCard from './monster-card'

const Monster = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getSingleMonster, deleteMonster } = useMonstersContext()

    const monster = useMemo(() => getSingleMonster?.(id), [id, getSingleMonster])

    const handleEdit = useCallback(() => {
        navigate(`/monster/${monster.id}/edit`)
    }, [monster, navigate])

    const handleDelete = useCallback(() => {
        deleteMonster(monster.id)
        navigate('/monsters')
    }, [monster, deleteMonster, navigate])

    return (
        <section>
            {monster ? (
                <>
                    <button onClick={handleEdit}>Edit</button>
                    <button className="delete" onClick={handleDelete}>Delete</button>
                    <MonsterCard name={monster.name} />
                </>
            ) : (
                <p>Sorry, the requested monster could not be found.</p>
            )}
        </section>
    )
}

export default Monster
