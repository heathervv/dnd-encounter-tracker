import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export const MonstersContext = createContext({})

const STORAGE_KEY = 'monsters'

export const MonstersProvider = ({ children }) => {
    const [monsters, setMonsters] = useState([])

    useEffect(() => {
        const savedMonsters = localStorage.getItem(STORAGE_KEY)

        if (savedMonsters) {
            setMonsters(JSON.parse(savedMonsters))
        }
    }, [])

    const saveMonsters = useCallback((monsters) => {
        const sorted = monsters.sort((a, b) => a.name.localeCompare(b.name))
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted))
        setMonsters(sorted)
    }, [setMonsters])

    return (
        <MonstersContext.Provider value={{ monsters, saveMonsters }}>
            {children}
        </MonstersContext.Provider>
    )
}

export const useMonstersContext = () => {
    const { monsters, saveMonsters } = useContext(MonstersContext)

    const getSingleMonster = useCallback((id) => (
        monsters.find((monster) => monster.id === id)
    ), [monsters])

    const createMonster = useCallback((monster) => {
        saveMonsters([...monsters, monster])
    }, [monsters, saveMonsters])

    const deleteMonster = useCallback((id) => {
        const updatedList = monsters.filter((monster) => monster.id !== id)
        saveMonsters(updatedList)
    }, [monsters, saveMonsters])

    const updateMonster = useCallback((monster) => {
        const list = monsters.filter((m) => m.id !== monster.id)
        saveMonsters([...list, monster])
    }, [monsters, saveMonsters])

    return { monsters, getSingleMonster, createMonster, deleteMonster, updateMonster }
}