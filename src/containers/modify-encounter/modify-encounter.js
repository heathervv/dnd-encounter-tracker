import { useCallback, useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { useEncountersContext } from "../../context/encounters/encounters-context";
import './modify-encounter.css'

const ModifyEncounter = ({ isEdit }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getSingleEncounter, createEncounter, updateEncounter } = useEncountersContext()
    const [form, setForm] = useState({
        name: '',
    })

    const encounter = useMemo(() => getSingleEncounter?.(id), [id, getSingleEncounter])

    useEffect(() => {
        if (encounter) {
            setForm(encounter)
        }
    }, [encounter])

    const handleFieldChange = (e, name) => {
        setForm({ ...form, [name]: e.target.value })
    }

    const handleSave = useCallback((e) => {
        e?.preventDefault();
        const form = e?.target
        const formData = new FormData(form)
        const formJson = Object.fromEntries(formData.entries())

        const id = isEdit ? encounter.id : uuidv4()

        const encounterData = {
            ...formJson,
            id
        }

        if (isEdit) {
            updateEncounter(encounterData)
        } else {
            createEncounter(encounterData)
        }

        form.reset()
        navigate(`/encounter/${id}`)
    }, [isEdit, encounter, createEncounter, updateEncounter, navigate])

    return (
        <section>
            <form onSubmit={handleSave}>
                <label>
                    Name*: <input required name="name" value={form.name} onChange={(e) => handleFieldChange(e, 'name')} />
                </label>
                <button type="submit">Save</button>
            </form>
        </section>
    )
}

export default ModifyEncounter
