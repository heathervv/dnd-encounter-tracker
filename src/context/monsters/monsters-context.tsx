import {
    createContext,
    useCallback,
    useContext,
} from 'react'

export type MONSTER = {
    id: string
    name: string
}

interface MonsterContextType {
    monsters?: MONSTER[]
    saveMonsters?: (value: MONSTER[]) => void
}

export const MonstersContext = createContext<MonsterContextType>({})

export const useMonstersContext = () => {
    const { monsters, saveMonsters } = useContext(MonstersContext)

    const getSingleMonster = useCallback(
        (id) => monsters?.find((monster) => monster.id === id),
        [monsters]
    )

    const createMonster = useCallback(
        (monster) => {
            saveMonsters?.([...(monsters || []), monster])
        },
        [monsters, saveMonsters]
    )

    const deleteMonster = useCallback(
        (id) => {
            const updatedList = monsters?.filter((monster) => monster.id !== id) || []
            saveMonsters?.(updatedList)
        },
        [monsters, saveMonsters]
    )

    const updateMonster = useCallback(
        (monster) => {
            const list = monsters?.filter((m) => m.id !== monster.id) || []
            saveMonsters?.([...list, monster])
        },
        [monsters, saveMonsters]
    )

    const importMonsters = useCallback(
        (data) => {
            saveMonsters?.(data)
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
