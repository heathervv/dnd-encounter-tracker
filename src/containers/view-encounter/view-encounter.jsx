import { useCallback, useMemo, useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useEncountersContext } from "../../context/encounters/encounters-context"
import { usePlayerContext } from "../../context/players/players-context"
import { useMonstersContext } from "../../context/monsters/monsters-context"
import Markdown from "../../components/markdown"
import { enrichMonsterData } from "../../helpers"
import MonsterCard from "../view-monster/monster-card"
import MonsterItem from "./item-monster"

const ViewEncounter = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getSingleEncounter, deleteEncounter } = useEncountersContext()
  const { players } = usePlayerContext()
  const { monsters: homebrewMonsters } = useMonstersContext()
  const [monsters, setMonsters] = useState([])
  const [monsterCard, showMonsterCard] = useState(null)

  const encounter = useMemo(
    () => getSingleEncounter?.(id),
    [id, getSingleEncounter]
  )

  useEffect(() => {
    if (!encounter) {
      return
    }

    let active = true
    loadMonsterData()
    return () => {
      active = false
    }

    async function loadMonsterData() {
      const res = await enrichMonsterData(encounter, homebrewMonsters)

      if (!active) {
        return
      }
      setMonsters(res)
    }
  }, [encounter, homebrewMonsters])

  const navigateToCombatTracker = useCallback(() => {
    navigate(`/combat-tracker/${encounter.id}`)
  }, [encounter, navigate])

  const handleEdit = useCallback(() => {
    navigate(`/encounter/${encounter.id}/edit`)
  }, [encounter, navigate])

  const handleDelete = useCallback(() => {
    deleteEncounter(encounter.id)
    navigate("/")
  }, [encounter, deleteEncounter, navigate])

  return (
    <section data-color-mode="light">
      {encounter ? (
        <>
          <div className="flex justify-between items-end mb-2">
            <h1 className="text-base-content font-semibold text-lg">
              {encounter.name}
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
                type="button"
                className="btn btn-xs btn-error"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="grid grid-cols-[0.5fr_1fr] gap-2">
            <div>
              <ul>
                {players.map((player) => (
                  <li
                    key={player.id}
                    className="card bg-base-100 card-border border-base-300 card-sm mb-2 shadow-xs"
                  >
                    <div className="card-body py-2 px-4 gap-0">
                      <p className="text-base-content text-base">
                        {player.name}
                      </p>
                      <div className="flex gap-4">
                        <p className="text-base-content grow-0 text-sm">
                          <span>Level: </span>
                          {player.level}
                        </p>
                        <p className="text-base-content grow-0 text-sm">
                          <span>AC: </span>
                          {player.armor_class}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div>
                <h3 className="text-base-content font-semibold mt-4 mb-2">
                  Monsters:
                </h3>
                {monsters.length > 0 ? (
                  <ul>
                    {monsters.map((monster) => {
                      const monsterId = monster.id || monster.index
                      return (
                        <MonsterItem
                          key={monsterId}
                          monsterId={monsterId}
                          monsterCard={monsterCard}
                          showMonsterCard={showMonsterCard}
                          monster={monster}
                          encounter={encounter}
                        />
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-base-content grow-0 text-sm">
                    Encounter currently has no monsters.
                  </p>
                )}
              </div>

              <button
                type="button"
                className="btn btn-sm btn-success mt-4"
                onClick={navigateToCombatTracker}
              >
                Run encounter
              </button>
            </div>
            <div>
              {encounter.description && (
                <div className="card bg-base-100 card-border border-base-300 card-sm mb-2 shadow-xs">
                  <div className="card-body py-2 px-4">
                    <h3 className="text-base-content font-semibold text-lg">
                      Encounter description
                    </h3>
                    <div className="markdown-wrapper-card">
                      <Markdown source={encounter.description} />
                    </div>
                  </div>
                </div>
              )}
              {monsterCard && <MonsterCard monster={monsterCard} />}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4 card bg-base-100 card-border border-base-300 card-sm">
          <p className="card-body py-2 px-4 gap-0 text-base-content text-sm italic">
            Sorry, the requested encounter could not be found.
          </p>
        </div>
      )}
    </section>
  )
}

export default ViewEncounter
