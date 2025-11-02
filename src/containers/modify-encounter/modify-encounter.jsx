import React, { useCallback, useMemo, useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import MDEditor from "@uiw/react-md-editor/nohighlight"
import { v4 as uuidv4 } from "uuid"
import AddMonsters from "../../components/add-monsters/add-monsters"
import { useEncountersContext } from "../../context/encounters/encounters-context"
import { useThemeContext } from "../../context/theme/theme-context"

export const MONSTER_ACTION = {
  ADD: "add",
  REMOVE: "remove",
}

const ModifyEncounter = ({ isEdit }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getSingleEncounter, createEncounter, updateEncounter } =
    useEncountersContext()
  const { wysiwygMode } = useThemeContext()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedMonsters, setSelectedMonsters] = useState([])
  const [amounts, setAmounts] = useState({}) // encounter?.amounts?.[monsterId]

  const encounter = useMemo(
    () => getSingleEncounter?.(id),
    [id, getSingleEncounter]
  )

  useEffect(() => {
    if (encounter) {
      setName(encounter.name)
      setDescription(encounter.description || "")
      setSelectedMonsters(encounter.monsters || [])
      setAmounts(encounter.amounts || {})
    }
  }, [encounter])

  const handleNameChange = useCallback(
    (e) => {
      setName(e.target.value)
    },
    [setName]
  )

  const handleMonsterSelect = useCallback(
    (action, selectedMonsterId, amount) => {
      // 1. Removing monster from encounter
      // 2. Adding monster to encounter
      // 3. Updating amounts for monster already added to encounter
      if (action === MONSTER_ACTION.REMOVE) {
        const updatedList = selectedMonsters.filter(
          (monsterId) => monsterId !== selectedMonsterId
        )
        setSelectedMonsters(updatedList)
        setAmounts({
          ...amounts,
          [selectedMonsterId]: 0,
        })
      } else if (
        action === MONSTER_ACTION.ADD &&
        !selectedMonsters.includes(selectedMonsterId)
      ) {
        setSelectedMonsters([...selectedMonsters, selectedMonsterId])
        setAmounts({
          ...amounts,
          [selectedMonsterId]: amount,
        })
      } else if (
        action === MONSTER_ACTION.ADD &&
        selectedMonsters.includes(selectedMonsterId)
      ) {
        setAmounts({
          ...amounts,
          [selectedMonsterId]: amount,
        })
      }
    },
    [selectedMonsters, amounts, setSelectedMonsters, setAmounts]
  )

  const handleSave = useCallback(
    (e) => {
      e?.preventDefault()
      const id = isEdit ? encounter.id : uuidv4()

      const encounterData = {
        id,
        name,
        description,
        monsters: selectedMonsters,
        amounts,
      }

      if (isEdit) {
        updateEncounter(encounterData)
      } else {
        createEncounter(encounterData)
      }

      navigate(`/encounter/${id}`)
    },
    [
      isEdit,
      encounter,
      name,
      description,
      selectedMonsters,
      amounts,
      createEncounter,
      updateEncounter,
      navigate,
    ]
  )

  return (
    <section className="max-w-4xl m-auto" data-color-mode={wysiwygMode}>
      <form onSubmit={handleSave}>
        <div className="flex justify-between items-end mb-2">
          <h1 className="text-base-content font-semibold text-lg">
            {isEdit ? `Edit ${encounter?.name}` : "Create encounter"}
          </h1>
          <button className="btn btn-xs btn-primary" type="submit">
            {isEdit ? "Save changes" : "Create encounter"}
          </button>
        </div>
        <label>
          <span className="block text-sm text-base-content">Name*:</span>
          <input
            className="input input-sm input-border w-full items-center mt-1 mb-4"
            required
            type="text"
            name="name"
            value={name}
            onChange={handleNameChange}
          />
        </label>
        <label>
          <span className="block text-sm text-base-content mb-2">
            Description:
          </span>
          <MDEditor value={description} onChange={setDescription} />
        </label>
        <AddMonsters
          onSelect={handleMonsterSelect}
          selectedMonsters={selectedMonsters}
          selectedAmount={amounts}
        />
      </form>
    </section>
  )
}

export default ModifyEncounter
