import React, { useCallback, useEffect, useState, useMemo } from 'react'

import { fetchMonsters, fetchSpecificMonster } from '../../api/dnd-api'
import MonsterCard from '../../containers/view-monster/monster-card'
import { useMonstersContext } from "../../context/monsters/monsters-context";

import './add-monsters.css'

const MonsterItem = ({ name, homebrew, monster, selected }) => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false)
    const [monsterData, setMonsterData] = useState({})

    const handleDrawer = useCallback(() => {
        if (drawerIsOpen) {
            setDrawerIsOpen(false)
            return
        }
        if (!homebrew) {
            fetchSpecificMonster(monster.index)
                .then((result) => {
                    setMonsterData(result)
                    setDrawerIsOpen(true)
                })
        } else {
            setDrawerIsOpen(true)
        }
    }, [homebrew, drawerIsOpen, monster])

    return (
        <li className="encounter-monster-item">
            <div className={`monster-link ${selected ? 'selected' : ''}`} onClick={handleDrawer}>
                <div className="monster-details">
                    <div>
                        <p className="monster-name">{name}</p>
                        {homebrew && <p className="monster-tag">Homebrew</p>}
                    </div>
                    {selected && <p className="monster-amount">x {selected}</p>}
                </div>
                <p className="view">{drawerIsOpen ? 'View less' : 'View more'}</p>
            </div>
            {drawerIsOpen && (
                <div className="drawer">
                    {/* @TODO(): ability to select/de-select monster */}
                    {/* @TODO(): ability to modify amount when selected */}
                    <MonsterCard monster={homebrew ? monster : monsterData} />
                </div>
            )}
        </li>
    )
}

const AddMonster = ({ selectedMonsters, selectedAmount }) => {
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
            hidden: searchValue && !hbm.name.toLowerCase().includes(searchValue.toLowerCase())
        }))

        const apiMonstersCaptured = apiMonsters.map((am) => ({
            ...am,
            hidden: searchValue && !am.name.toLowerCase().includes(searchValue.toLowerCase())
        }))

        return [...homebrewCaptured, ...apiMonstersCaptured]
    }, [homebrewMonsters, apiMonsters, searchValue])

    useEffect(() => {
        fetchMonsters()
            .then((response) => {
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
                    .filter((m) => !m.hidden && selectedMonsters.includes(m.id || m.index))
                    .map((monster) => (
                        <MonsterItem
                            key={monster.id || monster.index}
                            id={monster.id || monster.index}
                            name={monster.name}
                            homebrew={monster.homebrew}
                            monster={monster}
                            selected={selectedAmount[monster.id || monster.index]}
                        />
                    ))}
                {/* Monsters that meet the search criteria and HAVE NOT been selected */}
                {listOfMonsters
                    .filter((m) => !m.hidden && !selectedMonsters.includes(m.id || m.index))
                    .map((monster) => (
                        <MonsterItem
                            key={monster.id || monster.index}
                            id={monster.id || monster.index}
                            name={monster.name}
                            homebrew={monster.homebrew}
                            monster={monster}
                        />
                    ))}
            </ul>
        </div>
    )
}

export default AddMonster
