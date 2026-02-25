import {
    createContext,
    useCallback,
    useContext,
} from 'react'
import type { Monster } from '../../types/domain'

interface MonsterContextType {
    monsters: Monster[]
    saveMonsters: (value: Monster[]) => void
}

export const MonstersContext = createContext<MonsterContextType | null>(null)

export const useMonstersContext = () => {
    const context = useContext(MonstersContext)
    if (!context) {
        throw new Error('useMonstersContext must be used within MonstersProvider')
    }
    const { monsters, saveMonsters } = context

    const getSingleMonster = useCallback(
        (id: string | undefined) => monsters.find((monster) => monster.id === id),
        [monsters]
    )

    const createMonster = useCallback(
        (monster: Monster) => {
            saveMonsters([...monsters, monster])
        },
        [monsters, saveMonsters]
    )

    const deleteMonster = useCallback(
        (id: string) => {
            const updatedList = monsters.filter((monster) => monster.id !== id)
            saveMonsters(updatedList)
        },
        [monsters, saveMonsters]
    )

    const updateMonster = useCallback(
        (monster: Monster) => {
            const list = monsters.filter((m) => m.id !== monster.id)
            saveMonsters([...list, monster])
        },
        [monsters, saveMonsters]
    )

    const importMonsters = useCallback(
        (data: Monster[]) => {
            saveMonsters(data)
        },
        [saveMonsters]
    )

    return {
        monsters,
        getSingleMonster,
        createMonster,
        deleteMonster,
        updateMonster,
        importMonsters,
    }
}
