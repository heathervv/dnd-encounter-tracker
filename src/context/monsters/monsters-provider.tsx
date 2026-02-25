import {
    useCallback,
    useEffect,
    useState,
} from 'react'
import { MonstersContext } from './monsters-context'
import type { Monster } from '../../types/domain'

const STORAGE_KEY = 'monsters'

export const MonstersProvider = ({ children }: { children: React.ReactNode }) => {
    const [monsters, setMonsters] = useState<Monster[]>([])

    useEffect(() => {
        const savedMonsters = localStorage.getItem(STORAGE_KEY)

        if (savedMonsters) {
            setMonsters(JSON.parse(savedMonsters) as Monster[])
        }
    }, [])

    const saveMonsters = useCallback(
        (monsters: Monster[]) => {
            const sorted = monsters.sort((a, b) => a.name.localeCompare(b.name))
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted))
            setMonsters(sorted)
        },
        [setMonsters]
    )

    return (
        <MonstersContext.Provider value={{ monsters, saveMonsters }}>
            {children}
        </MonstersContext.Provider>
    )
}
