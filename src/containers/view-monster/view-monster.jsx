import { useCallback, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useMonstersContext } from "../../context/monsters/monsters-context"
import { useThemeContext } from "../../context/theme/theme-context"
import Markdown from "../../components/markdown"
import MonsterCard from "./monster-card"

const Monster = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getSingleMonster, deleteMonster } = useMonstersContext()
  const { wysiwygMode } = useThemeContext()

  const monster = useMemo(() => getSingleMonster?.(id), [id, getSingleMonster])

  const handleEdit = useCallback(() => {
    navigate(`/monster/${monster.id}/edit`)
  }, [monster, navigate])

  const handleDelete = useCallback(() => {
    deleteMonster(monster.id)
    navigate("/monsters")
  }, [monster, deleteMonster, navigate])

  return (
    <section className="max-w-4xl m-auto" data-color-mode={wysiwygMode}>
      {monster ? (
        <>
          <div className="flex justify-between items-end mb-2">
            <h1 className="text-base-content font-semibold text-lg">
              {monster.name}
            </h1>
            <div className="flex gap-2">
              <button
                className="btn btn-xs btn-primary"
                type="button"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="btn btn-xs btn-error"
                type="button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
          {monster.monsterCharacteristicsDescription && (
            <div className="markdown-wrapper mb-4">
              <Markdown source={monster.monsterCharacteristicsDescription} />
            </div>
          )}
          <MonsterCard monster={monster} />
        </>
      ) : (
        <div className="mt-4 card bg-base-100 card-border border-base-300 card-sm">
          <p className="card-body py-2 px-4 gap-0 text-base-content text-sm italic">
            Sorry, the requested monster could not be found.
          </p>
        </div>
      )}
    </section>
  )
}

export default Monster
