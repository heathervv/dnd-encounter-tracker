import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor/nohighlight'
import { useEncountersContext } from "../../context/encounters/encounters-context";
import { usePlayerContext } from "../../context/players/players-context";
import { useMonstersContext } from "../../context/monsters/monsters-context";
import MonsterCard from '../view-monster/monster-card'
import './combat-tracker.css'

import { baseAbilityScoreModifier } from '../../helpers'

// 6. Add ability to modify HP of monsters
// 7. Next button skips entries with 0 hp

const CombatTracker = () => {
    const { encounterId } = useParams()
    const { getSingleEncounter } = useEncountersContext()
    const { players } = usePlayerContext()
    const { monsters } = useMonstersContext()
    const [monsterCard, showMonsterCard] = useState(null)
    const [initiative, setInitiative] = useState({})
    const [combatStarted, setCombatStarted] = useState(false)
    const [selected, setSelected] = useState(null)
    const [round, setRound] = useState(1)

    const encounter = useMemo(() => getSingleEncounter?.(encounterId), [encounterId, getSingleEncounter])

    const entries = useMemo(() => {
        if (!encounter) {
            return []
        }

        const data = []

        encounter.monsters.forEach(monsterId => {
            const amount = parseInt(encounter.amounts[monsterId], 10)

            let i = 1;
            while (i <= amount) {
                data.push({
                    id: monsterId,
                    isMonster: true,
                    kind: i
                })
                i++
            }
        });

        const groupedData = [
            ...players,
            ...data
        ]

        if (combatStarted) {
            const compare = (a, b) => {
                let aInit = 0;
                let bInit = 0;

                if (a.kind && initiative[`${a.kind}-${a.id}`]) {
                    aInit = parseInt(initiative[`${a.kind}-${a.id}`], 10)
                } else if (initiative[a.id]) {
                    aInit = parseInt(initiative[a.id], 10)
                }

                if (b.kind && initiative[`${b.kind}-${b.id}`]) {
                    bInit = parseInt(initiative[`${b.kind}-${b.id}`], 10)
                } else if (initiative[b.id]) {
                    bInit = parseInt(initiative[b.id], 10)
                }

                // Actually compare them now
                if (aInit > bInit) {
                    return -1;
                }
                if (aInit < bInit) {
                    return 1;
                }
                return 0;
            }
            return groupedData.sort(compare)
        } else {
            return groupedData
        }
    }, [encounter, players, initiative, combatStarted])

    const handleStart = useCallback(() => {
        const unSetInitiative = {}
        entries.forEach((entry) => {
            if (entry.kind && !initiative[`${entry.kind}-${entry.id}`]) {
                unSetInitiative[`${entry.kind}-${entry.id}`] = 0
                return
            }

            if (!entry.kind && !initiative[entry.id]) {
                unSetInitiative[entry.id] = 0
                return
            }
        })

        setInitiative({
            ...initiative,
            ...unSetInitiative
        })
        setCombatStarted(true)
        setSelected(0)
    }, [setCombatStarted, initiative, entries, setInitiative, setSelected])

    const handleInitiativeUpdate = useCallback((e, id) => {
        if (combatStarted) {
            return
        }

        setInitiative({ ...initiative, [id]: e.target.value })
    }, [combatStarted, initiative, setInitiative])

    const handleNext = useCallback(() => {
        let update = 0

        if (selected === entries.length - 1) {
            update = 0
            setRound(round + 1)
        } else if (selected !== null) {
            update = selected + 1
        }

        setSelected(update)
    }, [entries, selected, setSelected, round, setRound])

    return (
        <section className="combat-tracker wrapper-large" data-color-mode="light">
            {encounter ? (
                <>
                    <div className="row">
                        <h1 className="encounter-title">{encounter.name}</h1>
                    </div>
                    <hr />
                    <div className="row row-align-top">
                        <div className="width-forty">
                            <div className="entries-list">
                                <ul>
                                    {(entries || []).map((entry, i) => {
                                        if (entry.isMonster) {
                                            const monster = monsters.find((m) => m.id === entry.id)
                                            const initBonus = baseAbilityScoreModifier(monster.dexterity)
                                            const id = `${entry.kind}-${monster.id}`

                                            return (
                                                <li key={id} className={selected === i ? 'selected' : ''}>
                                                    <div className="initiative">
                                                        <p>Initiative</p>
                                                        <input type="number" min="0" value={initiative[id]} disabled={combatStarted} onChange={(e) => handleInitiativeUpdate(e, id)} />
                                                    </div>
                                                    <button className={monsterCard?.monster.id === entry.id && monsterCard?.kind === entry.kind ? 'selected' : ''} type="button" onClick={() => showMonsterCard({ monster, kind: entry.kind })}>
                                                        <p>{monster.name}</p>
                                                        <div className="details">
                                                            <p><strong>CR: </strong>{monster.challengeRating}</p>
                                                            <p><strong>HP: </strong>{monster.averageHitPoints} ({monster.hitPointsDieCount}{monster.hitPointsDieValue}+{monster.hitPointsDieModifier})</p>
                                                            <p><strong>AC: </strong>{monster.armorClass}</p>
                                                            <p><strong>Init Bonus: </strong>{initBonus}</p>
                                                        </div>
                                                    </button>
                                                </li>
                                            )
                                        }

                                        return (
                                            <li key={entry.id} className={selected === i ? 'selected' : ''}>
                                                <div className="initiative">
                                                    <p>Initiative</p>
                                                    <input type="number" min="0" value={initiative[entry.id]} disabled={combatStarted} onChange={(e) => handleInitiativeUpdate(e, entry.id)} />
                                                </div>
                                                <div className="entry">
                                                    <p className="name">{entry.name}</p>
                                                    <div className="details">
                                                        <p><strong>Level: </strong>{entry.level}</p>
                                                        <p><strong>AC: </strong>{entry.armor_class}</p>
                                                        <p><strong>Init Bonus: </strong>{entry.initiative_bonus}</p>
                                                        <p><strong>Speed: </strong>{entry.speed}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div>
                                {combatStarted ? (
                                    <div className="combat-details">
                                        <p>Round: {round}</p>
                                        <button type="button" className="run-combat" onClick={handleNext}>Next</button>
                                    </div>
                                ) : (
                                    <button type="button" className="run-combat" onClick={handleStart}>Start encounter</button>
                                )}
                            </div>
                        </div>
                        <div className="width-sixty">
                            {monsterCard && <MonsterCard monster={monsterCard.monster} />}
                            {encounter.description &&
                                <div className="encounter-description">
                                    <h3 className="title">Encounter description</h3>
                                    <MDEditor.Markdown source={encounter.description} />
                                </div>
                            }
                        </div>
                    </div>
                </>
            ) : (
                <p>Sorry, the requested encounter could not be found.</p>
            )}
        </section>
    )
}

export default CombatTracker
