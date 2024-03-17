import React, { useCallback, useEffect, useState } from 'react'

import { fetchMonsters, fetchSpecificMonster } from '../../api/dnd-api'
import MonsterCard from '../../containers/view-monster/monster-card'
import { useMonstersContext } from "../../context/monsters/monsters-context";

import './add-monsters.css'

const MonsterItem = ({ name, homebrew, monster }) => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false)
    const [monsterData, setMonsterData] = useState({})

    const handleDrawer = useCallback(() => {
        setDrawerIsOpen(!drawerIsOpen)
        if (!homebrew) {
            fetchSpecificMonster(monster.index)
                .then((result) => setMonsterData(result))
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
                    {/* TODO(): ability to select/de-select monster with amount */}
                    {/* TODO(): loading state */}
                    <MonsterCard monster={homebrew ? monster : monsterData} />
                </div>
            )}
        </li>
    )
}

const AddMonster = () => {
    const { monsters: homebrewMonsters } = useMonstersContext()
    const [apiMonsters, setApiMonsters] = useState([])

    useEffect(() => {
        fetchMonsters()
            .then((response) => {
                setApiMonsters(response.results)
            })
    }, [])

    return (
        <div>
            <p>Monsters:</p>
            {/* NTH TODO(): add search? */}
            <ul className="encounter-monster-list">
                {homebrewMonsters.map((monster) => (
                    <MonsterItem
                        key={monster.id}
                        id={monster.id}
                        name={monster.name}
                        homebrew
                        monster={monster}
                    />
                ))}
                {apiMonsters.map((monster) => (
                    <MonsterItem
                        key={monster.index}
                        id={monster.index}
                        name={monster.name}
                        monster={monster}
                    />
                ))}
            </ul>
        </div>
    )
}

export default AddMonster
