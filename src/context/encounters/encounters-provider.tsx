import {
    useCallback,
    useEffect,
    useState,
} from 'react'
import { EncountersContext } from './encounters-context'
import type { Encounter } from '../../types/domain'

const STORAGE_KEY = 'encounters'

export const EncountersProvider = ({ children }: { children: React.ReactNode }) => {
    const [encounters, setEncounters] = useState<Encounter[]>([])

    useEffect(() => {
        const savedEncounters = localStorage.getItem(STORAGE_KEY)

        if (savedEncounters) {
            setEncounters(JSON.parse(savedEncounters) as Encounter[])
        }
    }, [])

    const saveEncounters = useCallback(
        (encounters: Encounter[]) => {
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
