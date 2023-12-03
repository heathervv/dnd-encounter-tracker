import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid';
import './custom-list.css'

const CustomList = ({ title, description, fieldKey, values, onValueChange }) => {
    const [createNew, setCreateNew] = useState(false)
    const [newItemName, setNewItemName] = useState('')
    const [newItemNote, setNewItemNote] = useState('')

    const handleAdd = useCallback(() => {
        setCreateNew(true)
    }, [setCreateNew])

    const handleReset = useCallback(() => {
        setNewItemName('')
        setNewItemNote('')
        setCreateNew(false)
    }, [setNewItemName, setNewItemNote, setCreateNew])

    const handleSave = useCallback(() => {
        if (!newItemName) {
            return
        }

        onValueChange([...values, { name: newItemName, note: newItemNote, id: uuidv4() }])

        handleReset()
    }, [values, newItemName, newItemNote, onValueChange, handleReset])

    const handleDelete = useCallback((id) => {
        const updatedOptions = values.filter((value) => value.id !== id)
        onValueChange(updatedOptions)
    }, [values, onValueChange])

    return (
        <div>
            <div className="row">
                <div>
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>
                <button onClick={handleAdd} type="button">Add option</button>
            </div>
            <ul className="list-table">
                <li>
                    <p>Name</p>
                    <p>Note</p>
                    <p></p>
                </li>
                {values.length > 0 ? values.map((value) => (
                    <li key={value.id}>
                        <p>{value.name}</p>
                        <p>{value.note}</p>
                        <div className="button-wrapper">
                            <button className="delete" type="button" onClick={() => handleDelete(value.id)}>Remove</button>
                        </div>
                    </li>
                )) : (
                    <li><p>No options added yet.</p></li>
                )}
                {createNew && (
                    <li>
                        <label>
                            <input aria-label="name" type="text" name={`${fieldKey}-new-name`} value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
                        </label>
                        <label>
                            <input aria-label="note" type="text" name={`${fieldKey}-new-note`} value={newItemNote} onChange={(e) => setNewItemNote(e.target.value)} />
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

export default CustomList