import {
    useCallback,
    useEffect,
    useState,
} from 'react'
import { EncountersContext } from './encounters-context'

const STORAGE_KEY = 'encounters'

export const EncountersProvider = ({ children }) => {
    const [encounters, setEncounters] = useState([])

    useEffect(() => {
        const savedEncounters = localStorage.getItem(STORAGE_KEY)

        if (savedEncounters) {
            setEncounters(JSON.parse(savedEncounters))
        }
    }, [])

    const saveEncounters = useCallback(
        (encounters) => {
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