import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid';

const SavingThrows = ({ fieldKey, values, onValueChange }) => {
    const handleAdd = useCallback(() => {
        onValueChange([...values, { ability: '', id: uuidv4() }])
    }, [values, onValueChange])

    const handleChange = useCallback((id, ability) => {
        const updatedOptions = values.filter((value) => value.id !== id)
        onValueChange([...updatedOptions, { ability, id }])
    }, [values, onValueChange])

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
                        <label>
                            <div className="select-wrapper">
                                <select name={`${fieldKey}`} value={value.ability} onChange={(e) => handleChange(value.id, e.target.value)}>
                                    <option disabled value="">-</option>
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
                            <button className="delete" type="button" onClick={() => handleDelete(value.id)}>Remove</button>
                        </div>
                    </li>
                )) : (
                    <li><p>No ability added yet.</p></li>
                )}
            </ul>
        </div>
    )
}

export default SavingThrows