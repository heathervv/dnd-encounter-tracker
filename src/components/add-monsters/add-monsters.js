import React, { useCallback, useEffect, useState } from 'react'

import { fetchMonsters, fetchSpecificMonster } from '../../api/dnd-api'
import MonsterCard from '../../containers/view-monster/monster-card'
import { useMonstersContext } from "../../context/monsters/monsters-context";

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
        <li>
            <div className="monster-link" onClick={handleDrawer}>
                <p className="monster-name">{name}</p>
                {homebrew && <p>Homebrew</p>}
                {drawerIsOpen ? 'View less' : 'View more'}
            </div>
            {drawerIsOpen && (
                <div>
                    {/* TODO(): ability to select/de-select monster with amount */}
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
            <p>Monsters</p>
            {/* NTH TODO(): add search? */}
            <ul className="monster-list">
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
