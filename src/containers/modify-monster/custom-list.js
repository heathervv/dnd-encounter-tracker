import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid';

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
            <h4>{title}</h4>
            <p>{description}.</p>
            <button onClick={handleAdd} type="button">Add option</button>
            <ul>
                <li>
                    <p>Name</p>
                    <p>Note</p>
                </li>
                {values.map((value) => (
                    <li key={value.id}>
                        <p>{value.name}</p>
                        <p>{value.note}</p>
                        <button type="button" onClick={() => handleDelete(value.id)}>Remove</button>
                    </li>
                ))}
                {createNew && (
                    <li>
                        <label>
                            Name: <input type="text" name={`${fieldKey}-new-name`} value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
                        </label>
                        <label>
                            Note: <input type="text" name={`${fieldKey}-new-note`} value={newItemNote} onChange={(e) => setNewItemNote(e.target.value)} />
                        </label>
                        <button type="button" onClick={handleSave}>Add</button>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default CustomList