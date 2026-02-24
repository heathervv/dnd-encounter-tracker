import {
    createContext,
    useCallback,
    useContext,
} from 'react'
import type { Monster } from '../../types/domain'

export type MONSTER = Monster

interface MonsterContextType {
    monsters: MONSTER[]
    saveMonsters: (value: MONSTER[]) => void
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
        (monster: MONSTER) => {
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
        (monster: MONSTER) => {
            const list = monsters.filter((m) => m.id !== monster.id)
            saveMonsters([...list, monster])
        },
        [monsters, saveMonsters]
    )

    const importMonsters = useCallback(
        (data: MONSTER[]) => {
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
