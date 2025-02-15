import { useCallback, useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useEncountersContext } from '../../context/encounters/encounters-context'
import { usePlayerContext } from '../../context/players/players-context'
import { useMonstersContext } from '../../context/monsters/monsters-context'
import Markdown from '../../components/markdown'
import { enrichMonsterData } from '../../helpers'
import MonsterCard from '../view-monster/monster-card'
import './combat-tracker.css'
import EntriesList from './entries-list'

const getId = (entry) =>
    entry.isMonster ? `${entry.kind}-${entry.id}` : entry.id

const DEATH_SAVES = {
    SUCCESS: 'success',
    FAILURE: 'failure',
}

const CombatTracker = () => {
    const { encounterId } = useParams()
    const { getSingleEncounter } = useEncountersContext()
    const { players } = usePlayerContext()
    const { monsters: homebrewMonsters } = useMonstersContext()
    const [monsters, setMonsters] = useState([])
    const [monsterCard, showMonsterCard] = useState(null)
    const [initiative, setInitiative] = useState({})
    const [combatStarted, setCombatStarted] = useState(false)
    const [selected, setSelected] = useState(null)
    const [round, setRound] = useState(1)
    const [health, setHealth] = useState({})
    const [modifyHPModal, showModifyHPModal] = useState(null)
    const [updatedHP, setUpdatedHP] = useState(0)
    const [deathSaves, setDeathSaves] = useState({})

    const encounter = useMemo(
        () => getSingleEncounter?.(encounterId),
        [encounterId, getSingleEncounter]
    )

    const completedWaitingForMonsters = useMemo(() => {
        if (encounter?.monsters?.length > 0) {
            return monsters.length > 0
        }

        return true
    }, [encounter, monsters])

    const loading = useMemo(
        () => !(encounter && completedWaitingForMonsters),
        [encounter, completedWaitingForMonsters]
    )

    const entries = useMemo(() => {
        if (!encounter) {
            return []
        }

        const data = []

        encounter.monsters.forEach((monsterId) => {
            const amount = parseInt(encounter.amounts[monsterId], 10)

            let i = 1
            while (i <= amount) {
                data.push({
                    id: monsterId,
                    isMonster: true,
                    kind: i,
                })
                i++
            }
        })

        const groupedData = [...players, ...data]

        if (combatStarted) {
            const compare = (a, b) => {
                let aInit = 0
                let bInit = 0

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
                    return -1
                }
                if (aInit < bInit) {
                    return 1
                }
                return 0
            }
            return groupedData.sort(compare)
        } else {
            return groupedData
        }
    }, [encounter, players, initiative, combatStarted])

    useEffect(() => {
        if (!encounter) {
            return
        }

        let active = true
        loadMonsterData()
        return () => {
            active = false
        }

        async function loadMonsterData() {
            const res = await enrichMonsterData(encounter, homebrewMonsters)

            if (!active) {
                return
            }
            setMonsters(res)
        }
    }, [encounter, homebrewMonsters])

    const handleStart = useCallback(() => {
        const health = {}
        const unSetInitiative = {}
        entries.forEach((entry) => {
            // set health for each entry
            if (entry.isMonster) {
                const monster = monsters.find((m) => m.id === entry.id)
                health[getId(entry)] = {
                    current: parseInt(monster.averageHitPoints, 10),
                    max: parseInt(monster.averageHitPoints, 10),
                }
            } else {
                health[getId(entry)] = {
                    current: entry.health,
                    max: entry.health,
                }
            }

            // Set 0 for initiative for all entries without
            if (!initiative[getId(entry)]) {
                unSetInitiative[getId(entry)] = 0
                return
            }
        })

        setInitiative({
            ...initiative,
            ...unSetInitiative,
        })
        setHealth(health)
        setCombatStarted(true)
        setSelected(0)
    }, [
        setCombatStarted,
        monsters,
        initiative,
        entries,
        setInitiative,
        setSelected,
        setHealth,
    ])

    const handleInitiativeUpdate = useCallback(
        (e, id) => {
            if (combatStarted) {
                return
            }

            setInitiative({ ...initiative, [id]: e.target.value })
        },
        [combatStarted, initiative, setInitiative]
    )

    const findNextIndex = useCallback(
        (index) => {
            const nextEntry = () => {
                let update = 0

                if (index === entries.length - 1) {
                    update = 0
                } else if (index !== null) {
                    update = index + 1
                }

                return update
            }

            const nextIndex = nextEntry()
            const idOfNextEntry = getId(entries[nextIndex])
            const healthOfNextEntry = health[idOfNextEntry].current

            if (healthOfNextEntry === 0) {
                return findNextIndex(nextIndex)
            } else {
                return nextIndex
            }
        },
        [entries, health]
    )

    const handleNext = useCallback(() => {
        const nextIndex = findNextIndex(selected)

        if (nextIndex <= selected) {
            setRound(round + 1)
        }

        setSelected(nextIndex)
    }, [selected, setSelected, round, setRound, findNextIndex])

    const updateHealth = useCallback(
        (healthEntry) => {
            setUpdatedHP(0)
            if (modifyHPModal === healthEntry) {
                showModifyHPModal(null)
            } else {
                showModifyHPModal(healthEntry)
            }
        },
        [modifyHPModal, setUpdatedHP, showModifyHPModal]
    )

    const captureUpdatedHP = useCallback(() => {
        const healthItem = health[modifyHPModal]
        const updatedCurrent =
            parseInt(healthItem.current, 10) + parseInt(updatedHP, 10)

        setHealth({
            ...health,
            [modifyHPModal]: {
                ...healthItem,
                current: updatedCurrent >= 0 ? updatedCurrent : 0,
            },
        })
        setUpdatedHP(0)
        showModifyHPModal(null)

        if (updatedCurrent > 0 && deathSaves[modifyHPModal]) {
            setDeathSaves({
                ...deathSaves,
                [modifyHPModal]: null,
            })
        }
    }, [
        health,
        modifyHPModal,
        updatedHP,
        deathSaves,
        setHealth,
        setUpdatedHP,
        showModifyHPModal,
        setDeathSaves,
    ])

    const captureDeathSave = useCallback(
        (id, type) => {
            const currentFailure = deathSaves[id]?.failure || 0
            const updatedFailure =
                type === DEATH_SAVES.FAILURE
                    ? currentFailure + 1
                    : currentFailure
            const currentSuccess = deathSaves[id]?.success || 0
            const updatedSuccess =
                type === DEATH_SAVES.SUCCESS
                    ? currentSuccess + 1
                    : currentSuccess

            // No need to capture the update, we've hit the max for the type
            if (
                (type === DEATH_SAVES.FAILURE && updatedFailure > 3) ||
                (type === DEATH_SAVES.SUCESS && updatedSuccess > 3)
            ) {
                return
            }

            setDeathSaves({
                ...deathSaves,
                [id]: {
                    failure: updatedFailure,
                    success: updatedSuccess,
                },
            })
        },
        [deathSaves, setDeathSaves]
    )

    if (loading) {
        return <></>
    }

    return (
        <section
            className="combat-tracker wrapper-large"
            data-color-mode="light"
        >
            {encounter ? (
                <>
                    <div className="row">
                        <h1 className="encounter-title">{encounter.name}</h1>
                    </div>
                    <hr />
                    <div className="row row-align-top">
                        <div className="width-forty">
                            <EntriesList
                                entries={entries}
                                monsters={monsters}
                                selected={selected}
                                combatStarted={combatStarted}
                                health={health}
                                getId={getId}
                                initiative={initiative}
                                handleInitiativeUpdate={handleInitiativeUpdate}
                                monsterCard={monsterCard}
                                showMonsterCard={showMonsterCard}
                                updateHealth={updateHealth}
                                deathSaves={deathSaves}
                                captureDeathSave={captureDeathSave}
                                DEATH_SAVES={DEATH_SAVES}
                                modifyHPModal={modifyHPModal}
                                captureUpdatedHP={captureUpdatedHP}
                                updatedHP={updatedHP}
                                setUpdatedHP={setUpdatedHP}
                            />
                            <div>
                                {combatStarted ? (
                                    <div className="combat-details">
                                        <p>Round: {round}</p>
                                        {entries.length > 0 && (
                                            <button
                                                type="button"
                                                className="run-combat"
                                                onClick={handleNext}
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className="run-combat"
                                        onClick={handleStart}
                                    >
                                        Start encounter
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="width-sixty">
                            {monsterCard && (
                                <div className="combat-monster">
                                    <MonsterCard
                                        monster={monsterCard.monster}
                                    />
                                </div>
                            )}
                            {encounter.description && (
                                <div className="combat-description">
                                    <h3 className="title">
                                        Encounter description
                                    </h3>
                                    <Markdown source={encounter.description} />
                                </div>
                            )}
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
