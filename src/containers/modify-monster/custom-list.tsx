import { useCallback } from "react"
import { v4 as uuidv4 } from "uuid"

type CustomListValue = {
  id: string
  name: string
  note: string
}

type CustomListProps = {
  title: string
  description: string
  fieldKey: string
  values: CustomListValue[]
  onValueChange: (values: CustomListValue[]) => void
}

const CustomList = ({
  title,
  description,
  fieldKey,
  values,
  onValueChange,
}: CustomListProps) => {
  const handleAdd = useCallback(() => {
    onValueChange([...values, { name: "", note: "", id: uuidv4() }])
  }, [values, onValueChange])

  const handleChange = useCallback(
    (id: string, name: string, note: string) => {
      const updatedOptions = values.filter((value) => value.id !== id)
      onValueChange([...updatedOptions, { name, note, id }])
    },
    [values, onValueChange]
  )

  const handleDelete = useCallback(
    (id: string) => {
      const updatedOptions = values.filter((value) => value.id !== id)
      onValueChange(updatedOptions)
    },
    [values, onValueChange]
  )

  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h4 className="text-base-content font-semibold text-base">{title}</h4>
          <p>{description}</p>
        </div>
        <button
          className="btn btn-sm btn-primary"
          onClick={handleAdd}
          type="button"
        >
          Add option
        </button>
      </div>
      <ul className="border border-neutral rounded">
        <li className="bg-neutral text-neutral-content text-sm flex items-center gap-1">
          <p className="p-2 w-[33%]">Name</p>
          <p className="p-2 grow">Note</p>
          <p></p>
        </li>
        {values.length > 0 ? (
          values.map((value) => (
            <li
              key={value.id}
              className="flex items-center text-sm gap-1 border-t"
            >
              <label className="p-2 w-[33%]">
                <input
                  className="input input-sm input-border w-full items-center"
                  aria-label="name"
                  type="text"
                  name={`${fieldKey}`}
                  value={value.name}
                  onChange={(e) =>
                    handleChange(value.id, e.target.value, value.note)
                  }
                />
              </label>
              <label className="p-2 grow">
                <input
                  className="input input-sm input-border w-full items-center"
                  aria-label="note"
                  type="text"
                  name={`${fieldKey}`}
                  value={value.note}
                  onChange={(e) =>
                    handleChange(value.id, value.name, e.target.value)
                  }
                />
              </label>
              <div>
                <button
                  className="btn btn-sm btn-error mr-2"
                  type="button"
                  onClick={() => handleDelete(value.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="bg-base text-base-content text-sm p-2">
            <p>No options added yet.</p>
          </li>
        )}
      </ul>
    </div>
  )
}

export default CustomList
