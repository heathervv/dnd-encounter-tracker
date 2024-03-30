import { useCallback, useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEncountersContext } from '../../context/encounters/encounters-context'
import { usePlayerContext } from '../../context/players/players-context'
import { useMonstersContext } from '../../context/monsters/monsters-context'
import Markdown from '../../components/markdown'
import { enrichMonsterData } from '../../helpers'
import MonsterCard from '../view-monster/monster-card'
import './view-encounter.css'

const ViewEncounter = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getSingleEncounter, deleteEncounter } = useEncountersContext()
    const { players } = usePlayerContext()
    const { monsters: homebrewMonsters } = useMonstersContext()
    const [monsters, setMonsters] = useState([])
    const [monsterCard, showMonsterCard] = useState(null)

    const encounter = useMemo(() => getSingleEncounter?.(id), [id, getSingleEncounter])

    useEffect(() => {
        if (!encounter) {
            return
        }

        let active = true
        loadMonsterData()
        return () => { active = false }

        async function loadMonsterData() {
            const res = await enrichMonsterData(encounter, homebrewMonsters)

            if (!active) { return }
            setMonsters(res)
        }
    }, [encounter, homebrewMonsters])

    const navigateToCombatTracker = useCallback(() => {
        navigate(`/combat-tracker/${encounter.id}`)
    }, [encounter, navigate])

    const handleEdit = useCallback(() => {
        navigate(`/encounter/${encounter.id}/edit`)
    }, [encounter, navigate])

    const handleDelete = useCallback(() => {
        deleteEncounter(encounter.id)
        navigate('/encounters')
    }, [encounter, deleteEncounter, navigate])

    return (
        <section className="view-encounter wrapper-large" data-color-mode="light">
            {encounter ? (
                <>
                    <div className="row">
                        <h1 className="encounter-title">{encounter.name}</h1>
                        <div className="manage-buttons">
                            <button type="button" onClick={handleEdit}>Edit</button>
                            <button type="button" className="delete" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                    <hr />
                    <div className="row row-align-top">
                        <div className="width-forty">
                            <div className="player-characters-list">
                                <ul>
                                    {players.map((player) => (
                                        <li key={player.id}>
                                            <p className="player-name">{player.name}</p>
                                            <div className="player-details">
                                                <p><strong>Level: </strong>{player.level}</p>
                                                <p><strong>AC: </strong>{player.armor_class}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="monsters-list">
                                <h3>Monsters:</h3>
                                {monsters.length > 0 ? (
                                    <ul>
                                        {monsters.map((monster) => {
                                            const monsterId = monster.id || monster.index
                                            return (
                                                <li key={monsterId}>
                                                    <button className={monsterCard?.id === monsterId ? 'selected' : ''} type="button" onClick={() => showMonsterCard(monster)}>
                                                        <div>
                                                            <p>{monster.name}</p>
                                                            <p>{monster.size} {monster.type}</p>
                                                        </div>
                                                        {encounter?.amounts?.[monsterId] > 1 &&
                                                            <div className="count">
                                                                <p>x {encounter?.amounts?.[monsterId]}</p>
                                                            </div>
                                                        }
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                ) : (
                                    <p>Encounter currently has no monsters.</p>
                                )}
                            </div>

                            <button type="button" className="run-combat" onClick={navigateToCombatTracker}>Run encounter</button>
                        </div>
                        <div className="width-sixty">
                            {encounter.description &&
                                <div className="encounter-description">
                                    <h3 className="title">Encounter description</h3>
                                    <Markdown source={encounter.description} />
                                </div>
                            }
                            {monsterCard && <MonsterCard monster={monsterCard} />}
                        </div>
                    </div>
                </>
            ) : (
                <p>Sorry, the requested encounter could not be found.</p>
            )}
        </section>
    )
}

export default ViewEncounter
