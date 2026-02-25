import {
    createContext,
    useCallback,
    useContext,
} from 'react'
import type { Encounter } from '../../types/domain'

interface EncounterContextType {
    encounters: Encounter[]
    saveEncounters: (value: Encounter[]) => void
}

export const EncountersContext = createContext<EncounterContextType | null>(null)

export const useEncountersContext = () => {
    const context = useContext(EncountersContext)
    if (!context) {
        throw new Error('useEncountersContext must be used within EncountersProvider')
    }
    const { encounters, saveEncounters } = context

    const getSingleEncounter = useCallback(
        (id: string | undefined) => encounters.find((encounter) => encounter.id === id),
        [encounters]
    )

    const createEncounter = useCallback(
        (encounter: Encounter) => {
            saveEncounters([...encounters, encounter])
        },
        [encounters, saveEncounters]
    )

    const deleteEncounter = useCallback(
        (id: string) => {
            const updatedList = encounters.filter(
                (encounter) => encounter.id !== id
            )
            saveEncounters(updatedList)
        },
        [encounters, saveEncounters]
    )

    const updateEncounter = useCallback(
        (encounter: Encounter) => {
            const list = encounters.filter((m) => m.id !== encounter.id)
            saveEncounters([...list, encounter])
        },
        [encounters, saveEncounters]
    )

    const importEncounters = useCallback(
        (data: Encounter[]) => {
            saveEncounters(data)
        },
        [saveEncounters]
    )

    return {
        encounters,
        getSingleEncounter,
        createEncounter,
        deleteEncounter,
        updateEncounter,
        importEncounters,
    }
}
