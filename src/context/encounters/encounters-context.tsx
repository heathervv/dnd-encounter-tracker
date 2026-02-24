import {
    createContext,
    useCallback,
    useContext,
} from 'react'
import type { Encounter } from '../../types/domain'

export type ENCOUNTER = Encounter

interface EncounterContextType {
    encounters: ENCOUNTER[]
    saveEncounters: (value: ENCOUNTER[]) => void
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
        (encounter: ENCOUNTER) => {
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
        (encounter: ENCOUNTER) => {
            const list = encounters.filter((m) => m.id !== encounter.id)
            saveEncounters([...list, encounter])
        },
        [encounters, saveEncounters]
    )

    const importEncounters = useCallback(
        (data: ENCOUNTER[]) => {
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
