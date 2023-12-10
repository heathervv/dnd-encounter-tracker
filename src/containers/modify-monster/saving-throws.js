import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid';
import './custom-list.css'

const SavingThrows = ({ fieldKey, values, onValueChange }) => {
    const [createNew, setCreateNew] = useState(false)
    const [newAbility, setNewAbility] = useState('-')

    const handleAdd = useCallback(() => {
        setCreateNew(true)
    }, [setCreateNew])

    const handleReset = useCallback(() => {
        setNewAbility('-')
        setCreateNew(false)
    }, [setNewAbility, setCreateNew])

    const handleSave = useCallback(() => {
        if (newAbility === '-') {
            return
        }

        onValueChange([...values, { ability: newAbility, id: uuidv4() }])

        handleReset()
    }, [values, newAbility, onValueChange, handleReset])

    const handleDelete = useCallback((id) => {
        const updatedOptions = values.filter((value) => value.id !== id)
        onValueChange(updatedOptions)
    }, [values, onValueChange])

    return (
        <div>
            <div className="row">
                <div>
                    <h4>Saving Throw Proficiences</h4>
                    <p>Add each ability your monster is proficient in when saving.</p>
                </div>
                <button onClick={handleAdd} type="button">Add ability</button>
            </div>
            <ul className="list-table">
                <li>
                    <p>Ability</p>
                    <p></p>
                </li>
                {values.length > 0 ? values.map((value) => (
                    <li key={value.id}>
                        <p>{value.ability}</p>
                        <div className="button-wrapper">
                            <button className="delete" type="button" onClick={() => handleDelete(value.id)}>Remove</button>
                        </div>
                    </li>
                )) : (
                    <li><p>No ability added yet.</p></li>
                )}
                {createNew && (
                    <li>
                        <label>
                            <div className="select-wrapper">
                                <select name={`${fieldKey}-new-ability`} value={newAbility} onChange={(e) => setNewAbility(e.target.value)}>
                                    <option disabled value="-">-</option>
                                    <option value="Strength">Strength</option>
                                    <option value="Dexterity">Dexterity</option>
                                    <option value="Constitution">Constitution</option>
                                    <option value="Intelligence">Intelligence</option>
                                    <option value="Wisdom">Wisdom</option>
                                    <option value="Charisma">Charisma</option>
                                </select>
                            </div>
                        </label>
                        <div className="button-wrapper">
                            <button type="button" onClick={handleSave}>Add</button>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default SavingThrows