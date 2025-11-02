import { useCallback } from "react"
import { v4 as uuidv4 } from "uuid"

const SavingThrows = ({ fieldKey, values, onValueChange }) => {
  const handleAdd = useCallback(() => {
    onValueChange([...values, { ability: "", id: uuidv4() }])
  }, [values, onValueChange])

  const handleChange = useCallback(
    (id, ability) => {
      const updatedOptions = values.filter((value) => value.id !== id)
      onValueChange([...updatedOptions, { ability, id }])
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
    <div className="mb-4">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h4 className="text-base-content font-semibold text-base">
            Saving Throw Proficiences
          </h4>
          <p className="text-base-content">
            Add each ability your monster is proficient in when saving.
          </p>
        </div>
        <button
          className="btn btn-sm btn-primary"
          onClick={handleAdd}
          type="button"
        >
          Add ability
        </button>
      </div>
      <ul className="border border-neutral rounded">
        <li className="bg-neutral text-neutral-content text-sm flex items-center gap-1">
          <p className="p-2 w-[33%]">Ability</p>
          <p className="p-2 grow"></p>
        </li>
        {values.length > 0 ? (
          values.map((value) => (
            <li
              key={value.id}
              className="flex items-center text-sm gap-1 border-t"
            >
              <label className="p-2 w-[33%]">
                <select
                  className="input input-sm input-border w-full items-center"
                  name={`${fieldKey}`}
                  value={value.ability}
                  onChange={(e) => handleChange(value.id, e.target.value)}
                >
                  <option disabled value="">
                    -
                  </option>
                  <option value="Strength">Strength</option>
                  <option value="Dexterity">Dexterity</option>
                  <option value="Constitution">Constitution</option>
                  <option value="Intelligence">Intelligence</option>
                  <option value="Wisdom">Wisdom</option>
                  <option value="Charisma">Charisma</option>
                </select>
              </label>
              <button
                className="btn btn-sm btn-error"
                type="button"
                onClick={() => handleDelete(value.id)}
              >
                Remove
              </button>
            </li>
          ))
        ) : (
          <li className="bg-base text-base-content text-sm p-2">
            <p>No ability added yet.</p>
          </li>
        )}
      </ul>
    </div>
  )
}

export default SavingThrows
