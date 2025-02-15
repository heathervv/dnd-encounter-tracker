import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor/nohighlight'
import { v4 as uuidv4 } from 'uuid'
import AddMonsters from '../../components/add-monsters/add-monsters'
import { useEncountersContext } from '../../context/encounters/encounters-context'
import './modify-encounter.css'

export const MONSTER_ACTION = {
    ADD: 'add',
    REMOVE: 'remove',
}

const ModifyEncounter = ({ isEdit }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getSingleEncounter, createEncounter, updateEncounter } =
        useEncountersContext()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedMonsters, setSelectedMonsters] = useState([])
    const [amounts, setAmounts] = useState({}) // encounter?.amounts?.[monsterId]

    const encounter = useMemo(
        () => getSingleEncounter?.(id),
        [id, getSingleEncounter]
    )

    useEffect(() => {
        if (encounter) {
            setName(encounter.name)
            setDescription(encounter.description || '')
            setSelectedMonsters(encounter.monsters || [])
            setAmounts(encounter.amounts || {})
        }
    }, [encounter])

    const handleNameChange = useCallback(
        (e) => {
            setName(e.target.value)
        },
        [setName]
    )

    const handleMonsterSelect = useCallback(
        (action, selectedMonsterId, amount) => {
            // 1. Removing monster from encounter
            // 2. Adding monster to encounter
            // 3. Updating amounts for monster already added to encounter
            if (action === MONSTER_ACTION.REMOVE) {
                const updatedList = selectedMonsters.filter(
                    (monsterId) => monsterId !== selectedMonsterId
                )
                setSelectedMonsters(updatedList)
                setAmounts({
                    ...amounts,
                    [selectedMonsterId]: 0,
                })
            } else if (
                action === MONSTER_ACTION.ADD &&
                !selectedMonsters.includes(selectedMonsterId)
            ) {
                setSelectedMonsters([...selectedMonsters, selectedMonsterId])
                setAmounts({
                    ...amounts,
                    [selectedMonsterId]: amount,
                })
            } else if (
                action === MONSTER_ACTION.ADD &&
                selectedMonsters.includes(selectedMonsterId)
            ) {
                setAmounts({
                    ...amounts,
                    [selectedMonsterId]: amount,
                })
            }
        },
        [selectedMonsters, amounts, setSelectedMonsters, setAmounts]
    )

    const handleSave = useCallback(
        (e) => {
            e?.preventDefault()
            const id = isEdit ? encounter.id : uuidv4()

            const encounterData = {
                id,
                name,
                description,
                monsters: selectedMonsters,
                amounts,
            }

            if (isEdit) {
                updateEncounter(encounterData)
            } else {
                createEncounter(encounterData)
            }

            navigate(`/encounter/${id}`)
        },
        [
            isEdit,
            encounter,
            name,
            description,
            selectedMonsters,
            amounts,
            createEncounter,
            updateEncounter,
            navigate,
        ]
    )

    return (
        <section className="wrapper" data-color-mode="light">
            <form onSubmit={handleSave}>
                <div className="header">
                    <h1>
                        {isEdit
                            ? `Edit ${encounter?.name}`
                            : 'Create encounter'}
                    </h1>
                    <button type="submit">
                        {isEdit ? 'Save changes' : 'Create encounter'}
                    </button>
                </div>
                <label>
                    Name*:{' '}
                    <input
                        required
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleNameChange}
                    />
                </label>
                <label>
                    Description:
                    <MDEditor value={description} onChange={setDescription} />
                </label>
                <AddMonsters
                    onSelect={handleMonsterSelect}
                    selectedMonsters={selectedMonsters}
                    selectedAmount={amounts}
                />
            </form>
        </section>
    )
}

export default ModifyEncounter
