import { useCallback, useEffect, useMemo, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"

import { usePlayerContext } from "../../context/players/players-context"
import type { Player } from "../../types/domain"

type ModifyPlayerProps = {
  isEdit?: boolean
}

type PlayerNumericField =
  | "level"
  | "initiative_bonus"
  | "armor_class"
  | "speed"
  | "passive_perception"
  | "health"

type PlayerForm = Omit<Player, "id"> & { id?: string }

const defaultForm: PlayerForm = {
  name: "",
  level: null,
  initiative_bonus: null,
  armor_class: null,
  speed: null,
  passive_perception: null,
  health: null,
}

const numericFields: PlayerNumericField[] = [
  "level",
  "initiative_bonus",
  "armor_class",
  "speed",
  "passive_perception",
  "health",
]

const ModifyPlayer = ({ isEdit = false }: ModifyPlayerProps) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getSinglePlayer, createPlayer, updatePlayer } = usePlayerContext()
  const [form, setForm] = useState<PlayerForm>(defaultForm)

  const player = useMemo(() => getSinglePlayer(id), [id, getSinglePlayer])

  useEffect(() => {
    if (player) {
      setForm(player)
    }
  }, [player])

  const handleFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, name: keyof PlayerForm) => {
      const rawValue = e.target.value

      if (numericFields.includes(name as PlayerNumericField)) {
        setForm((prev) => ({
          ...prev,
          [name]: rawValue === "" ? null : Number(rawValue),
        }))
        return
      }

      setForm((prev) => ({
        ...prev,
        [name]: rawValue,
      }))
    },
    []
  )

  const handleSave = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const playerId = isEdit ? player?.id : uuidv4()

      if (!playerId) {
        return
      }

      const playerData: Player = {
        ...form,
        id: playerId,
      }

      if (isEdit) {
        updatePlayer(playerData)
      } else {
        createPlayer(playerData)
      }

      navigate(`/player/${playerId}`)
    },
    [isEdit, player, form, createPlayer, updatePlayer, navigate]
  )

  return (
    <section className="max-w-4xl m-auto">
      <h1 className="text-base-content font-semibold text-lg">
        {isEdit ? `Edit ${player?.name}` : "Create player character"}
      </h1>
      <form onSubmit={handleSave}>
        <div>
          <label>
            <span className="block text-sm text-base-content">Name*:</span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="text"
              required
              name="name"
              value={form.name}
              onChange={(e) => handleFieldChange(e, "name")}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <label className="grow">
            <span className="block text-sm text-base-content">Level*:</span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="level"
              value={form.level ?? ""}
              onChange={(e) => handleFieldChange(e, "level")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">
              Initiative bonus*:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="initiative_bonus"
              value={form.initiative_bonus ?? ""}
              onChange={(e) => handleFieldChange(e, "initiative_bonus")}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <label className="grow">
            <span className="block text-sm text-base-content">
              Armor Class*:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="armor_class"
              value={form.armor_class ?? ""}
              onChange={(e) => handleFieldChange(e, "armor_class")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">Speed*:</span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="speed"
              value={form.speed ?? ""}
              onChange={(e) => handleFieldChange(e, "speed")}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <label className="grow">
            <span className="block text-sm text-base-content">
              Passive Perception*:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="passive_perception"
              value={form.passive_perception ?? ""}
              onChange={(e) => handleFieldChange(e, "passive_perception")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">
              Health points*:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="health"
              value={form.health ?? ""}
              onChange={(e) => handleFieldChange(e, "health")}
            />
          </label>
        </div>
        <hr className="my-4 border-base-content/10" />
        <button className="btn btn-primary btn-sm m-auto block" type="submit">
          {isEdit ? "Save changes" : "Create player character"}
        </button>
      </form>
    </section>
  )
}

export default ModifyPlayer
