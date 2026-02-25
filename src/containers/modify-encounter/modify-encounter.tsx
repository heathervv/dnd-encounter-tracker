import { useCallback, useEffect, useMemo, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"
import MDEditor from "@uiw/react-md-editor/nohighlight"
import { v4 as uuidv4 } from "uuid"
import AddMonsters from "../../components/add-monsters/add-monsters"
import { useEncountersContext } from "../../context/encounters/encounters-context"
import { useThemeContext } from "../../context/theme/theme-context"

export const MONSTER_ACTION = {
  ADD: "add",
  REMOVE: "remove",
} as const

export type MonsterAction = (typeof MONSTER_ACTION)[keyof typeof MONSTER_ACTION]

type ModifyEncounterProps = {
  isEdit?: boolean
}

const ModifyEncounter = ({ isEdit = false }: ModifyEncounterProps) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getSingleEncounter, createEncounter, updateEncounter } =
    useEncountersContext()
  const { wysiwygMode } = useThemeContext()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedMonsters, setSelectedMonsters] = useState<string[]>([])
  const [amounts, setAmounts] = useState<Record<string, number>>({})

  const encounter = useMemo(() => getSingleEncounter(id), [id, getSingleEncounter])

  useEffect(() => {
    if (encounter) {
      setName(encounter.name)
      setDescription(encounter.description || "")
      setSelectedMonsters(encounter.monsters || [])
      setAmounts(encounter.amounts || {})
    }
  }, [encounter])

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }, [])

  const handleMonsterSelect = useCallback(
    (action: MonsterAction, selectedMonsterId: string, amount?: number) => {
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
          [selectedMonsterId]: amount || 1,
        })
      } else if (
        action === MONSTER_ACTION.ADD &&
        selectedMonsters.includes(selectedMonsterId)
      ) {
        setAmounts({
          ...amounts,
          [selectedMonsterId]: amount || 1,
        })
      }
    },
    [selectedMonsters, amounts]
  )

  const handleSave = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const encounterId = isEdit ? encounter?.id : uuidv4()

      if (!encounterId) {
        return
      }

      const encounterData = {
        id: encounterId,
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

      navigate(`/encounter/${encounterId}`)
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
          <MDEditor value={description} onChange={(value) => setDescription(value || "")} />
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
