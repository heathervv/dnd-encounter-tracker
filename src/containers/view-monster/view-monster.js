import { useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMonstersContext } from "../../context/monsters/monsters-context";
import Markdown from '../../components/markdown'
import MonsterCard from './monster-card'
import './view-monster.css'

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
        <section className="wrapper" data-color-mode="light">
            {monster ? (
                <>
                    <div className="header">
                        <h1>{monster.name}</h1>
                        <div className="buttons">
                            <button type="button" onClick={handleEdit}>Edit</button>
                            <button type="button" className="delete" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                    {monster.monsterCharacteristicsDescription && (
                        <div className="monster-description">
                            <Markdown source={monster.monsterCharacteristicsDescription} />
                        </div>
                    )}
                    <MonsterCard monster={monster} />
                </>
            ) : (
                <p>Sorry, the requested monster could not be found.</p>
            )}
        </section>
    )
}

export default Monster
