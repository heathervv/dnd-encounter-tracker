import {
    createContext,
    useCallback,
    useContext,
} from 'react'

export type ENCOUNTER = {
    id: string
    monsters: string[]
}

interface EncounterContextType {
    encounters?: ENCOUNTER[]
    saveEncounters?: (value: ENCOUNTER[]) => void
}

export const EncountersContext = createContext<EncounterContextType>({})

export const useEncountersContext = () => {
    const { encounters, saveEncounters } = useContext(EncountersContext)

    const getSingleEncounter = useCallback(
        (id) => encounters?.find((encounter) => encounter.id === id),
        [encounters]
    )

    const createEncounter = useCallback(
        (encounter) => {
            saveEncounters?.([...(encounters || []), encounter])
        },
        [encounters, saveEncounters]
    )

    const deleteEncounter = useCallback(
        (id) => {
            const updatedList = encounters?.filter(
                (encounter) => encounter.id !== id
            ) || []
            saveEncounters?.(updatedList)
        },
        [encounters, saveEncounters]
    )

    const updateEncounter = useCallback(
        (encounter) => {
            const list = encounters?.filter((m) => m.id !== encounter.id) || []
            saveEncounters?.([...list, encounter])
        },
        [encounters, saveEncounters]
    )

    const importEncounters = useCallback(
        (data) => {
            saveEncounters?.(data)
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
