import React, { useCallback, useEffect, useState, useMemo } from 'react'

import { fetchMonsters, fetchSpecificMonster } from '../../api/dnd-api'
import MonsterCard from '../../containers/view-monster/monster-card'
import { useMonstersContext } from "../../context/monsters/monsters-context";

import './add-monsters.css'

const MonsterItem = ({ name, homebrew, monster }) => {
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
            <div className="monster-link" onClick={handleDrawer}>
                <div className="monster-details">
                    <p className="monster-name">{name}</p>
                    {homebrew && <p className="monster-tag">Homebrew</p>}
                </div>
                <p className="view">{drawerIsOpen ? 'View less' : 'View more'}</p>
            </div>
            {drawerIsOpen && (
                <div className="drawer">
                    {/* @TODO(): ability to select/de-select monster with amount */}
                    <MonsterCard monster={homebrew ? monster : monsterData} />
                </div>
            )}
        </li>
    )
}

const AddMonster = () => {
    const { monsters: homebrewMonsters } = useMonstersContext()
    const [apiMonsters, setApiMonsters] = useState([])
    const [searchValue, updateSearchValue] = useState('')

    const listOfMonsters = useMemo(() => {
        // It is definitely not ideal to loop through each array twice to complete this
        // However the data set it's working with is incredibly small so this is not
        // currently causing any performance issues. 
        // @TODO(): refactoring this would be ideal.
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
                {listOfMonsters.filter((m) => !m.hidden).map((monster) => (
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
