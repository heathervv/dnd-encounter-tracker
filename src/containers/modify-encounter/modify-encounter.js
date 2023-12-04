import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor/nohighlight'
import { v4 as uuidv4 } from 'uuid';
import { useEncountersContext } from "../../context/encounters/encounters-context";
import { useMonstersContext } from "../../context/monsters/monsters-context";
import './modify-encounter.css'

const ModifyEncounter = ({ isEdit }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getSingleEncounter, createEncounter, updateEncounter } = useEncountersContext()
    const { monsters } = useMonstersContext()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedMonsters, setSelectedMonsters] = useState([])
    const [amounts, setAmounts] = useState({}) // encounter?.amounts?.[monsterId]

    const encounter = useMemo(() => getSingleEncounter?.(id), [id, getSingleEncounter])

    useEffect(() => {
        if (encounter) {
            setName(encounter.name)
            setDescription(encounter.description || '')
            setSelectedMonsters(encounter.monsters || [])
            setAmounts(encounter.amounts || {})
        }
    }, [encounter])

    const handleNameChange = useCallback((e) => {
        setName(e.target.value)
    }, [setName])

    const handleMonsterSelect = useCallback((e) => {
        if (selectedMonsters.includes(e.target.value)) {
            const updatedList = selectedMonsters.filter((monsterId) => monsterId !== e.target.value)
            setSelectedMonsters(updatedList)
            setAmounts({
                ...amounts,
                [e.target.value]: 0
            })
        } else {
            setSelectedMonsters([...selectedMonsters, e.target.value])
            setAmounts({
                ...amounts,
                [e.target.value]: 1
            })
        }
    }, [selectedMonsters, amounts, setSelectedMonsters, setAmounts])

    const handleMonsterAmount = useCallback((e, monsterId) => {
        setAmounts({
            ...amounts,
            [monsterId]: e.target.value
        })
    }, [amounts, setAmounts])

    const handleSave = useCallback((e) => {
        e?.preventDefault();
        const id = isEdit ? encounter.id : uuidv4()

        const encounterData = {
            id,
            name,
            description,
            monsters: selectedMonsters,
            amounts
        }

        if (isEdit) {
            updateEncounter(encounterData)
        } else {
            createEncounter(encounterData)
        }

        navigate(`/encounter/${id}`)
    }, [isEdit, encounter, name, description, selectedMonsters, amounts, createEncounter, updateEncounter, navigate])

    return (
        <section className="wrapper" data-color-mode="light">
            <h1>{isEdit ? `Edit ${encounter?.name}` : 'Create encounter'}</h1>
            <form onSubmit={handleSave}>
                <label>
                    Name*: <input required type="text" name="name" value={name} onChange={handleNameChange} />
                </label>
                <label>
                    Description:
                    <MDEditor
                        value={description}
                        onChange={setDescription}
                    />
                </label>
                <fieldset>
                    <legend>Monsters</legend>
                    {monsters.map((monster) => (
                        <div className="option" key={monster.id}>
                            <input type="checkbox" checked={selectedMonsters.includes(monster.id)} name={monster.name} value={monster.id} onChange={handleMonsterSelect} />{monster.name}
                            {selectedMonsters.includes(monster.id) && (
                                <input type="number" min="1" name={`${monster.name}-amount`} value={amounts?.[monster.id]} onChange={(e) => handleMonsterAmount(e, monster.id)} />
                            )}
                        </div>
                    ))}
                </fieldset>
                <hr />
                <button className="save" type="submit">{isEdit ? 'Save changes' : 'Create encounter'}</button>
            </form>
        </section>
    )
}

export default ModifyEncounter
