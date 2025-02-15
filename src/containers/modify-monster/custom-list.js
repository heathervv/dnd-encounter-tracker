import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import './custom-list.css'

const CustomList = ({
    title,
    description,
    fieldKey,
    values,
    onValueChange,
}) => {
    const handleAdd = useCallback(() => {
        onValueChange([...values, { name: '', note: '', id: uuidv4() }])
    }, [values, onValueChange])

    const handleChange = useCallback(
        (id, name, note) => {
            const updatedOptions = values.filter((value) => value.id !== id)
            onValueChange([...updatedOptions, { name, note, id }])
        },
        [values, onValueChange]
    )

    const handleDelete = useCallback(
        (id) => {
            const updatedOptions = values.filter((value) => value.id !== id)
            onValueChange(updatedOptions)
        },
        [values, onValueChange]
    )

    return (
        <div>
            <div className="row">
                <div>
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>
                <button onClick={handleAdd} type="button">
                    Add option
                </button>
            </div>
            <ul className="list-table">
                <li>
                    <p>Name</p>
                    <p>Note</p>
                    <p></p>
                </li>
                {values.length > 0 ? (
                    values.map((value) => (
                        <li key={value.id}>
                            <label>
                                <input
                                    aria-label="name"
                                    type="text"
                                    name={`${fieldKey}`}
                                    value={value.name}
                                    onChange={(e) =>
                                        handleChange(
                                            value.id,
                                            e.target.value,
                                            value.note
                                        )
                                    }
                                />
                            </label>
                            <label>
                                <input
                                    aria-label="note"
                                    type="text"
                                    name={`${fieldKey}`}
                                    value={value.note}
                                    onChange={(e) =>
                                        handleChange(
                                            value.id,
                                            value.name,
                                            e.target.value
                                        )
                                    }
                                />
                            </label>
                            <div className="button-wrapper">
                                <button
                                    className="delete"
                                    type="button"
                                    onClick={() => handleDelete(value.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li>
                        <p>No options added yet.</p>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default CustomList
