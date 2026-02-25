import { useState } from "react"
import type { Dispatch, FormEvent, MouseEvent, SetStateAction } from "react"
import Concentrate from "../../assets/concentrate"
import Skull from "../../assets/skull"
import { baseAbilityScoreModifier } from "../../helpers"
import type { Monster } from "../../types/domain"
import type {
  CombatEntry,
  DeathSaveState,
  DeathSaveType,
  HealthState,
  InitiativeState,
  MonsterCardData,
} from "./types"

type EntriesListProps = {
  entries: CombatEntry[]
  monsters: Monster[]
  selected: number | null
  combatStarted: boolean
  health: HealthState
  getId: (entry: CombatEntry) => string
  initiative: InitiativeState
  handleInitiativeUpdate: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void
  showMonsterCard: Dispatch<SetStateAction<MonsterCardData | null>>
  updateHealth: (id: string) => void
  deathSaves: DeathSaveState
  captureDeathSave: (id: string, type: DeathSaveType) => void
  DEATH_SAVES: { SUCCESS: DeathSaveType; FAILURE: DeathSaveType }
  modifyHPModal: string | null
  captureUpdatedHP: (e: FormEvent<HTMLFormElement>) => void
  updatedHP: number
  setUpdatedHP: Dispatch<SetStateAction<number>>
}

const EntriesList = ({
  entries,
  monsters,
  selected,
  combatStarted,
  health,
  getId,
  initiative,
  handleInitiativeUpdate,
  showMonsterCard,
  updateHealth,
  deathSaves,
  captureDeathSave,
  DEATH_SAVES,
  modifyHPModal,
  captureUpdatedHP,
  updatedHP,
  setUpdatedHP,
}: EntriesListProps) => {
  const [concentrating, setConcentrating] = useState<Record<string, boolean>>({})

  const handleConcentrate = (key: string, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setConcentrating((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <ul>
      {(entries || []).map((entry, i) => {
        let monster: Monster | null = null
        let initBonus: number | null = null
        if (entry.isMonster) {
          monster = monsters.find((m) => m.id === entry.id) || null
          initBonus = monster
            ? baseAbilityScoreModifier(Number(monster.dexterity))
            : 0
        }

        const statuses: string[] = []

        if (selected === i) {
          statuses.push("selected")
        }
        if (combatStarted && health[getId(entry)]?.current === 0) {
          statuses.push("dead")
        }

        return (
          <li key={getId(entry)} className="relative">
            <div
              className={`
                ${!statuses.includes("selected") &&
                statuses.includes("dead") &&
                "border-base-300 "
                }
                ${statuses.includes("selected") && "border-success "}
                ${statuses.includes("dead") && "border-error/50 "}
                bg-base-100 card card-border border-base-300 card-sm mb-2 shadow-xs overflow-hidden`}
            >
              <div className="card-body p-0 gap-0">
                <div className="flex">
                  <div className="bg-base-200 shrink flex flex-col justify-center items-center gap-2 p-1.5">
                    <p className="grow-0 text-xs text-base-content uppercase">
                      Initiative
                    </p>
                    <input
                      className="w-10 border border-base-content/25 bg-white pl-2 py-1 rounded-sm"
                      id={`initiative-${getId(entry)}`}
                      type="number"
                      min="0"
                      value={initiative[getId(entry)] ?? 0}
                      onChange={(e) => handleInitiativeUpdate(e, getId(entry))}
                    />
                  </div>
                  <div className="grow flex justify-between">
                    <div className="p-2 grow">
                      {entry.isMonster ? (
                        <button
                          className="block w-full text-left"
                          type="button"
                          onClick={() => {
                            if (!monster) {
                              return
                            }
                            showMonsterCard({
                              monster,
                              kind: entry.kind,
                            })
                          }}
                        >
                          <div className="flex mb-1">
                            <button
                              type="button"
                              onClick={(e) => handleConcentrate(getId(entry), e)}
                            >
                              <Concentrate
                                size={20}
                                color={
                                  concentrating[getId(entry)]
                                    ? "#FC5454"
                                    : "#d0d7de"
                                }
                              />
                            </button>
                            <p className="pl-1 text-base-content font-semibold text-sm">
                              {monster?.name || "Unknown monster"}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-x-2">
                            <p className="text-base-content text-sm">
                              <span className="font-semibold">AC: </span>
                              {monster?.armorClass}
                            </p>
                            <p className="text-base-content text-sm">
                              <span className="font-semibold">
                                Init Bonus:{" "}
                              </span>
                              {initBonus}
                            </p>
                            <p className="text-base-content text-sm">
                              <span className="font-semibold">HP: </span>
                              {monster?.averageHitPoints} (
                              {monster?.hitPointsDieCount}
                              {monster?.hitPointsDieValue}+
                              {monster?.hitPointsDieModifier})
                            </p>
                          </div>
                        </button>
                      ) : (
                        <div>
                          <div className="flex mb-1">
                            <button
                              type="button"
                              onClick={(e) => handleConcentrate(getId(entry), e)}
                            >
                              <Concentrate
                                size={20}
                                color={
                                  concentrating[getId(entry)]
                                    ? "#FC5454"
                                    : "#d0d7de"
                                }
                              />
                            </button>
                            <p className="pl-1 text-base-content font-semibold text-sm">
                              {entry.name}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-x-2">
                            <p className="text-base-content text-sm">
                              <span className="font-semibold">AC: </span>
                              {entry.armor_class}
                            </p>
                            <p className="text-base-content text-sm">
                              <span className="font-semibold">
                                Init Bonus:{" "}
                              </span>
                              {entry.initiative_bonus}
                            </p>
                            <p className="text-base-content text-sm">
                              <span className="font-semibold">
                                Pass. Perception:{" "}
                              </span>
                              {entry.passive_perception}
                            </p>
                            <p className="text-base-content text-sm">
                              <span className="font-semibold">Speed: </span>
                              {entry.speed}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {combatStarted && (
                      <div
                        className="bg-base-200 min-w-[75px] p-1.5 flex flex-col justify-center items-center"
                        onClick={() => updateHealth(getId(entry))}
                      >
                        <ul className="flex flex-row">
                          <li className="text-sm text-base-content">
                            {health[getId(entry)]?.current ?? 0}
                          </li>
                          <li className="text-sm text-base-content">/</li>
                          <li className="text-sm text-base-content">
                            {health[getId(entry)]?.max ?? 0}
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {statuses.includes("dead") && (
                  <div className="flex gap-1 bg-base-100 items-center p-2 border-t border-base-content/10">
                    <Skull size={20} color="#333" />
                    <ul className="flex flex-row-reverse gap-1 items-center">
                      {new Array(3).fill(0).map((_, o) => (
                        <li className="h-4" key={`failure-${o}`}>
                          <button
                            type="button"
                            className={`w-4 h-4 rounded-full border ${(deathSaves[getId(entry)]?.failure || 0) >= o + 1
                                ? "bg-error"
                                : ""
                              }`}
                            onClick={() =>
                              captureDeathSave(
                                getId(entry),
                                DEATH_SAVES.FAILURE
                              )
                            }
                          />
                        </li>
                      ))}
                    </ul>
                    <div className="h-4 border-l border-base-content/25 mx-1" />
                    <ul className="flex gap-1 items-center">
                      {new Array(3).fill(0).map((_, o) => (
                        <li className="h-4" key={`success-${o}`}>
                          <button
                            type="button"
                            className={`w-4 h-4 rounded-full border 
                              ${(deathSaves[getId(entry)]?.success || 0) >=
                                o + 1
                                ? "bg-success"
                                : ""
                              }`}
                            onClick={() =>
                              captureDeathSave(
                                getId(entry),
                                DEATH_SAVES.SUCCESS
                              )
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {modifyHPModal === getId(entry) && (
              <div className="absolute left-full top-[50%] -translate-y-1/2 -translate-x-[15px] bg-base-100 z-1 shadow-md border border-base-300 rounded-sm">
                <form
                  onSubmit={captureUpdatedHP}
                  className="flex flex-col gap-2 p-2"
                >
                  <input
                    type="number"
                    autoFocus
                    value={updatedHP === 0 ? "" : updatedHP}
                    onChange={(e) => setUpdatedHP(Number(e.target.value) || 0)}
                    className="input input-xs input-border w-full items-center"
                  />
                  <button className="btn btn-xs btn-accent" type="submit">
                    Update
                  </button>
                </form>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default EntriesList
