import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

    const encounter = useMemo(() => getSingleEncounter?.(id), [id, getSingleEncounter])

    useEffect(() => {
        if (encounter) {
            setName(encounter.name)
            setDescription(encounter.description || '')
            setSelectedMonsters(encounter.monsters || [])
        }
    }, [encounter])

    const handleNameChange = useCallback((e) => {
        setName(e.target.value)
    }, [setName])

    const handleDescriptionChange = useCallback((e) => {
        setDescription(e.target.value)
    }, [setDescription])

    const handleMonsterSelect = useCallback((e) => {
        if (selectedMonsters.includes(e.target.value)) {
            const updatedList = selectedMonsters.filter((monsterId) => monsterId !== e.target.value)
            setSelectedMonsters(updatedList)
        } else {
            setSelectedMonsters([...selectedMonsters, e.target.value])
        }
    }, [selectedMonsters, setSelectedMonsters])

    const handleSave = useCallback((e) => {
        e?.preventDefault();
        const id = isEdit ? encounter.id : uuidv4()

        const encounterData = {
            id,
            name,
            description,
            monsters: selectedMonsters
        }

        if (isEdit) {
            updateEncounter(encounterData)
        } else {
            createEncounter(encounterData)
        }

        navigate(`/encounter/${id}`)
    }, [isEdit, encounter, name, description, selectedMonsters, createEncounter, updateEncounter, navigate])

    return (
        <section>
            <form onSubmit={handleSave}>
                <label>
                    Name*: <input required name="name" value={name} onChange={handleNameChange} />
                </label>
                <label>
                    Description: <input name="description" value={description} onChange={handleDescriptionChange} />
                </label>
                <fieldset>
                    <legend>Monsters</legend>
                    {monsters.map((monster) => (
                        <React.Fragment key={monster.id}>
                            <input type="checkbox" checked={selectedMonsters.includes(monster.id)} name={monster.name} value={monster.id} onChange={handleMonsterSelect} />{monster.name}
                        </React.Fragment>
                    ))}
                </fieldset>
                <button type="submit">Save</button>
            </form>
        </section>
    )
}

export default ModifyEncounter
