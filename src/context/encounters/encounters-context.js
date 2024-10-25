import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export const EncountersContext = createContext({})

const STORAGE_KEY = 'encounters'

export const EncountersProvider = ({ children }) => {
    const [encounters, setEncounters] = useState([])

    useEffect(() => {
        const savedEncounters = localStorage.getItem(STORAGE_KEY)

        if (savedEncounters) {
            setEncounters(JSON.parse(savedEncounters))
        }
    }, [])

    const saveEncounters = useCallback((encounters) => {
        const sorted = encounters.sort((a, b) => a.name.localeCompare(b.name))
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted))
        setEncounters(sorted)
    }, [setEncounters])

    return (
        <EncountersContext.Provider value={{ encounters, saveEncounters }}>
            {children}
        </EncountersContext.Provider>
    )
}

export const useEncountersContext = () => {
    const { encounters, saveEncounters } = useContext(EncountersContext)

    const getSingleEncounter = useCallback((id) => (
        encounters.find((encounter) => encounter.id === id)
    ), [encounters])

    const createEncounter = useCallback((encounter) => {
        saveEncounters([...encounters, encounter])
    }, [encounters, saveEncounters])

    const deleteEncounter = useCallback((id) => {
        const updatedList = encounters.filter((encounter) => encounter.id !== id)
        saveEncounters(updatedList)
    }, [encounters, saveEncounters])

    const updateEncounter = useCallback((encounter) => {
        const list = encounters.filter((m) => m.id !== encounter.id)
        saveEncounters([...list, encounter])
    }, [encounters, saveEncounters])

    const importEncounters = useCallback((data) => {
        saveEncounters(data)
    }, [saveEncounters])

    return {
        encounters,
        getSingleEncounter,
        createEncounter,
        deleteEncounter,
        updateEncounter,
        importEncounters
    }
}