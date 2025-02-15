import React, { useCallback, useEffect, useState, useMemo } from 'react'

import { fetchMonsters, fetchSpecificMonster } from '../../api/dnd-api'
import MonsterCard from '../../containers/view-monster/monster-card'
import { useMonstersContext } from '../../context/monsters/monsters-context'
import { MONSTER_ACTION } from '../../containers/modify-encounter/modify-encounter'

import './add-monsters.css'

const MonsterItem = ({ name, homebrew, monster, selected, onSelect }) => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false)
    const [monsterData, setMonsterData] = useState({})

    const handleDrawer = useCallback(
        async (e) => {
            if (e.target.tagName.toLowerCase() === 'button') {
                // Drawer should not be altered if a button (add/remove) was pressed
                return
            }

            if (drawerIsOpen) {
                setDrawerIsOpen(false)
                return
            }
            if (!homebrew) {
                const result = await fetchSpecificMonster(monster.index)

                setMonsterData(result)
                setDrawerIsOpen(true)
            } else {
                setDrawerIsOpen(true)
            }
        },
        [homebrew, drawerIsOpen, monster]
    )

    const handleAdd = useCallback(
        (e) => {
            e.preventDefault()
            onSelect(MONSTER_ACTION.ADD, monster.id || monster.index, 1)
        },
        [onSelect, monster]
    )

    const handleRemove = useCallback(
        (e) => {
            e.preventDefault()
            onSelect(MONSTER_ACTION.REMOVE, monster.id || monster.index)
        },
        [onSelect, monster]
    )

    const handleAmountChange = useCallback(
        (e, value) => {
            e.preventDefault()
            onSelect(
                MONSTER_ACTION.ADD,
                monster.id || monster.index,
                value || 1
            )
        },
        [onSelect, monster]
    )

    return (
        <li className="encounter-monster-item">
            <div
                className={`monster-link ${selected ? 'selected' : ''}`}
                onClick={handleDrawer}
            >
                <div className="monster-details">
                    <p className="monster-name">{name}</p>
                    {homebrew && <p className="monster-tag">Homebrew</p>}
                </div>
                <div className="manage">
                    {selected && (
                        <div className="amount">
                            <button
                                onClick={(e) =>
                                    handleAmountChange(e, selected - 1)
                                }
                            >
                                -
                            </button>
                            <p>{selected}</p>
                            <button
                                onClick={(e) =>
                                    handleAmountChange(e, selected + 1)
                                }
                            >
                                +
                            </button>
                        </div>
                    )}
                    {selected ? (
                        <button onClick={handleRemove}>- Remove</button>
                    ) : (
                        <button onClick={handleAdd}>+ Add</button>
                    )}
                    <p className="view">
                        {drawerIsOpen ? 'View less' : 'View more'}
                    </p>
                </div>
            </div>
            {drawerIsOpen && (
                <div className="drawer">
                    <MonsterCard monster={homebrew ? monster : monsterData} />
                </div>
            )}
        </li>
    )
}

const AddMonster = ({ onSelect, selectedMonsters, selectedAmount }) => {
    const { monsters: homebrewMonsters } = useMonstersContext()
    const [apiMonsters, setApiMonsters] = useState([])
    const [searchValue, updateSearchValue] = useState('')

    const listOfMonsters = useMemo(() => {
        // It is definitely not ideal to loop through these lists as often as I am
        // to complete this. However the data set it's working with is incredibly
        // small so this is not currently causing any performance issues and I care
        // more about getting something working then it being right (for now).
        // @TODO(): a refactor should still happen though.
        const homebrewCaptured = homebrewMonsters.map((hbm) => ({
            ...hbm,
            homebrew: true,
            hidden:
                searchValue &&
                !hbm.name.toLowerCase().includes(searchValue.toLowerCase()),
        }))

        const apiMonstersCaptured = apiMonsters.map((am) => ({
            ...am,
            hidden:
                searchValue &&
                !am.name.toLowerCase().includes(searchValue.toLowerCase()),
        }))

        return [...homebrewCaptured, ...apiMonstersCaptured]
    }, [homebrewMonsters, apiMonsters, searchValue])

    useEffect(() => {
        fetchMonsters().then((response) => {
            setApiMonsters(response.results)
        })
    }, [])

    const handleSearch = useCallback((e) => {
        e.preventDefault()
        updateSearchValue(e.target.value)
    }, [])

    const disableEnter = (e) => {
        if (e.code === 'Enter') {
            e.preventDefault()
        }
    }

    return (
        <div>
            <p>Monsters:</p>
            <input
                className="encounter-monster-search-input"
                type="text"
                value={searchValue}
                placeholder="Filter list of monsters..."
                onChange={handleSearch}
                onKeyDown={disableEnter}
            />
            <hr />
            <ul className="encounter-monster-list">
                {/* Monsters that meet the search criteria AND have been added to the encounter */}
                {listOfMonsters
                    .filter(
                        (m) =>
                            !m.hidden &&
                            selectedMonsters.includes(m.id || m.index)
                    )
                    .map((monster) => (
                        <MonsterItem
                            key={monster.id || monster.index}
                            id={monster.id || monster.index}
                            name={monster.name}
                            homebrew={monster.homebrew}
                            monster={monster}
                            selected={
                                selectedAmount[monster.id || monster.index]
                            }
                            onSelect={onSelect}
                        />
                    ))}
                {/* Monsters that meet the search criteria and HAVE NOT been selected */}
                {listOfMonsters
                    .filter(
                        (m) =>
                            !m.hidden &&
                            !selectedMonsters.includes(m.id || m.index)
                    )
                    .map((monster) => (
                        <MonsterItem
                            key={monster.id || monster.index}
                            id={monster.id || monster.index}
                            name={monster.name}
                            homebrew={monster.homebrew}
                            monster={monster}
                            onSelect={onSelect}
                        />
                    ))}
            </ul>
        </div>
    )
}

export default AddMonster
