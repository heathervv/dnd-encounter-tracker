import {
    useCallback,
    useEffect,
    useState,
} from 'react'
import { EncountersContext } from './encounters-context'
import type { ENCOUNTER } from './encounters-context'

const STORAGE_KEY = 'encounters'

export const EncountersProvider = ({ children }: { children: React.ReactNode }) => {
    const [encounters, setEncounters] = useState<ENCOUNTER[]>([])

    useEffect(() => {
        const savedEncounters = localStorage.getItem(STORAGE_KEY)

        if (savedEncounters) {
            setEncounters(JSON.parse(savedEncounters) as ENCOUNTER[])
        }
    }, [])

    const saveEncounters = useCallback(
        (encounters: ENCOUNTER[]) => {
            const sorted = encounters.sort((a, b) =>
                a.name.localeCompare(b.name)
            )
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted))
            setEncounters(sorted)
        },
        [setEncounters]
    )

    return (
        <EncountersContext.Provider value={{ encounters, saveEncounters }}>
            {children}
        </EncountersContext.Provider>
    )
}
