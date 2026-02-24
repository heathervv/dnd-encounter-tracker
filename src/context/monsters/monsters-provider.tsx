import {
    useCallback,
    useEffect,
    useState,
} from 'react'
import { MonstersContext } from './monsters-context'
import type { MONSTER } from './monsters-context'

const STORAGE_KEY = 'monsters'

export const MonstersProvider = ({ children }: { children: React.ReactNode }) => {
    const [monsters, setMonsters] = useState<MONSTER[]>([])

    useEffect(() => {
        const savedMonsters = localStorage.getItem(STORAGE_KEY)

        if (savedMonsters) {
            setMonsters(JSON.parse(savedMonsters) as MONSTER[])
        }
    }, [])

    const saveMonsters = useCallback(
        (monsters: MONSTER[]) => {
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
