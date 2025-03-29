import { useState } from 'react'
import Concentrate from '../../assets/concentrate'
import Skull from '../../assets/skull'
import { baseAbilityScoreModifier } from '../../helpers'

const EntriesList = ({
    entries,
    monsters,
    selected,
    combatStarted,
    health,
    getId,
    initiative,
    handleInitiativeUpdate,
    monsterCard,
    showMonsterCard,
    updateHealth,
    deathSaves,
    captureDeathSave,
    DEATH_SAVES,
    modifyHPModal,
    captureUpdatedHP,
    updatedHP,
    setUpdatedHP,
}) => {
    const [concentrating, setConcentrating] = useState({})

    const handleConcentrate = (key) => setConcentrating({
        ...concentrating,
        [key]: !concentrating[key]
    })

    return (
        <div className="entries-list">
            <ul>
                {(entries || []).map((entry, i) => {
                    let monster = null
                    let initBonus = null
                    if (entry.isMonster) {
                        monster = monsters.find((m) => m.id === entry.id)
                        initBonus = baseAbilityScoreModifier(monster.dexterity)
                    }

                    let statuses = []

                    if (selected === i) {
                        statuses.push('selected')
                    }
                    if (combatStarted && health[getId(entry)].current === 0) {
                        statuses.push('dead')
                    }

                    return (
                        <li key={getId(entry)} className={statuses.join(' ')}>
                            <div className="block">
                                <div className="initiative">
                                    <p>Initiative</p>
                                    <input
                                        type="number"
                                        min="0"
                                        value={initiative[getId(entry)]}
                                        onChange={(e) =>
                                            handleInitiativeUpdate(e, getId(entry))
                                        }
                                    />
                                </div>
                                <div className="entry-wrapper">
                                    {entry.isMonster ? (
                                        <button
                                            className={
                                                monsterCard?.monster.id ===
                                                    entry.id &&
                                                    monsterCard?.kind === entry.kind
                                                    ? 'selected monster'
                                                    : 'monster'
                                            }
                                            type="button"
                                            onClick={() =>
                                                showMonsterCard({
                                                    monster,
                                                    kind: entry.kind,
                                                })
                                            }
                                        >
                                            <div className="alignHorizontal">
                                                <button className="concentration" onClick={() => handleConcentrate(getId(entry))}>
                                                    <Concentrate size={20} color={concentrating[getId(entry)] ? '#FC5454' : '#d0d7de'} />
                                                </button>
                                                <p className="name">{monster.name}</p>
                                            </div>
                                            <div className="details">
                                                <p>
                                                    <strong>AC: </strong>
                                                    {monster.armorClass}
                                                </p>
                                                <p>
                                                    <strong>HP: </strong>
                                                    {monster.averageHitPoints} (
                                                    {monster.hitPointsDieCount}
                                                    {monster.hitPointsDieValue}+
                                                    {monster.hitPointsDieModifier})
                                                </p>
                                                <p>
                                                    <strong>Init Bonus: </strong>
                                                    {initBonus}
                                                </p>
                                            </div>
                                        </button>
                                    ) : (
                                        <div className="entry">
                                            <div className="alignHorizontal">
                                                <button className="concentration" onClick={() => handleConcentrate(getId(entry))}>
                                                    <Concentrate size={20} color={concentrating[getId(entry)] ? '#FC5454' : '#d0d7de'} />
                                                </button>
                                                <p className="name">{entry.name}</p>
                                            </div>
                                            <div className="details">
                                                <p>
                                                    <strong>AC: </strong>
                                                    {entry.armor_class}
                                                </p>
                                                <p>
                                                    <strong>Init Bonus: </strong>
                                                    {entry.initiative_bonus}
                                                </p>
                                                <p>
                                                    <strong>
                                                        Pass. Perception:{' '}
                                                    </strong>
                                                    {entry.passive_perception}
                                                </p>
                                                <p>
                                                    <strong>Speed: </strong>
                                                    {entry.speed}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {combatStarted && (
                                        <div
                                            className="health"
                                            onClick={() =>
                                                updateHealth(getId(entry))
                                            }
                                        >
                                            <ul>
                                                <li>
                                                    {health[getId(entry)].current}
                                                </li>
                                                <li>/</li>
                                                <li>{health[getId(entry)].max}</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {statuses.includes('dead') && (
                                <div className="death-saves">
                                    <div className="icon">
                                        <Skull size={20} color="#333" />
                                    </div>
                                    <ul className="failure">
                                        {new Array(3).fill(0).map((_, o) => (
                                            <li key={`failure-${o}`}>
                                                <button
                                                    className={
                                                        (deathSaves[getId(entry)]
                                                            ?.failure || 0) >=
                                                            o + 1
                                                            ? 'filled'
                                                            : `o-${o}`
                                                    }
                                                    onClick={() =>
                                                        captureDeathSave(
                                                            getId(entry),
                                                            DEATH_SAVES.FAILURE
                                                        )
                                                    }
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="separator" />
                                    <ul className="success">
                                        {new Array(3).fill(0).map((_, o) => (
                                            <li key={`success-${o}`}>
                                                <button
                                                    className={
                                                        (deathSaves[getId(entry)]
                                                            ?.success || 0) >=
                                                            o + 1
                                                            ? 'filled'
                                                            : ''
                                                    }
                                                    onClick={() =>
                                                        captureDeathSave(
                                                            getId(entry),
                                                            DEATH_SAVES.SUCCESS
                                                        )
                                                    }
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {modifyHPModal === getId(entry) && (
                                <div className="hp-modal">
                                    <form onSubmit={captureUpdatedHP}>
                                        <input
                                            type="number"
                                            autoFocus
                                            value={updatedHP === 0 ? '' : updatedHP}
                                            onChange={(e) =>
                                                setUpdatedHP(e.target.value)
                                            }
                                        />
                                        <button type="submit">Update</button>
                                    </form>
                                </div>
                            )}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default EntriesList
