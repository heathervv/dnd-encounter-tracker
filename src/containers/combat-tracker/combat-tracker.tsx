import { useCallback, useEffect, useMemo, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { useParams, useLocation } from "react-router-dom"
import { useEncountersContext } from "../../context/encounters/encounters-context"
import { usePlayerContext } from "../../context/players/players-context"
import { useMonstersContext } from "../../context/monsters/monsters-context"
import { useThemeContext } from "../../context/theme/theme-context"
import Markdown from "../../components/markdown"
import { enrichMonsterData, toNumber } from "../../helpers"
import MonsterCard from "../view-monster/monster-card"
import EntriesList from "./entries-list"
import type { Monster } from "../../types/domain"
import type {
  CombatEntry,
  CombatStorageData,
  DeathSaveState,
  DeathSaveType,
  HealthState,
  InitiativeState,
  MonsterCardData,
} from "./types"

const getId = (entry: CombatEntry): string =>
  entry.isMonster ? `${entry.kind}-${entry.id}` : entry.id

const DEATH_SAVES: { SUCCESS: DeathSaveType; FAILURE: DeathSaveType } = {
  SUCCESS: "success",
  FAILURE: "failure",
}

const defaultStorageData: CombatStorageData = {
  initiative: {},
  combatStarted: false,
  selected: null,
  round: 1,
  health: {},
  deathSaves: {},
}

const CombatTracker = () => {
  const location = useLocation()
  const resume = Boolean((location.state as { resume?: boolean } | null)?.resume)
  const { encounterId } = useParams()
  const { getSingleEncounter } = useEncountersContext()
  const { players } = usePlayerContext()
  const { monsters: homebrewMonsters } = useMonstersContext()
  const { wysiwygMode } = useThemeContext()
  const [loadingSavedData, setLoadingSavedData] = useState(true)
  const [monsters, setMonsters] = useState<Monster[]>([])
  const [monsterCard, showMonsterCard] = useState<MonsterCardData | null>(null)
  const [initiative, setInitiative] = useState<InitiativeState>({})
  const [combatStarted, setCombatStarted] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [round, setRound] = useState(1)
  const [health, setHealth] = useState<HealthState>({})
  const [modifyHPModal, showModifyHPModal] = useState<string | null>(null)
  const [updatedHP, setUpdatedHP] = useState(0)
  const [deathSaves, setDeathSaves] = useState<DeathSaveState>({})

  const encounter = useMemo(
    () => getSingleEncounter(encounterId),
    [encounterId, getSingleEncounter]
  )

  const completedWaitingForMonsters = useMemo(() => {
    if (encounter?.monsters?.length && encounter.monsters.length > 0) {
      return monsters.length > 0
    }

    return true
  }, [encounter, monsters])

  // @FIX(): there's a bug - when the requested encounter doesn't exist loading will never resolve
  const loading = useMemo(
    () => !(encounter && completedWaitingForMonsters),
    [encounter, completedWaitingForMonsters]
  )

  const entries = useMemo<CombatEntry[]>(() => {
    if (!encounter) {
      return []
    }

    const data: CombatEntry[] = []

    encounter.monsters.forEach((monsterId) => {
      const amount = toNumber(encounter.amounts[monsterId])

      let i = 1
      while (i <= amount) {
        data.push({
          id: monsterId,
          isMonster: true,
          kind: i,
        })
        i++
      }
    })

    const groupedData: CombatEntry[] = [...players, ...data]

    if (combatStarted) {
      const compare = (a: CombatEntry, b: CombatEntry) => {
        const getInitiativeValue = (entry: CombatEntry): number => {
          if (entry.isMonster) {
            return toNumber(initiative[`${entry.kind}-${entry.id}`])
          }
          return toNumber(initiative[entry.id])
        }

        const aInit = getInitiativeValue(a)
        const bInit = getInitiativeValue(b)

        if (aInit > bInit) {
          return -1
        }
        if (aInit < bInit) {
          return 1
        }
        return 0
      }

      return [...groupedData].sort(compare)
    }

    return groupedData
  }, [encounter, players, initiative, combatStarted])

  const STORAGE_KEY = `combat-${encounterId}`

  const saveDataToStorage = useCallback(
    (
      nextInitiative: InitiativeState,
      nextCombatStarted: boolean,
      nextSelected: number | null,
      nextRound: number,
      nextHealth: HealthState,
      nextDeathSaves: DeathSaveState
    ) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          initiative: nextInitiative,
          combatStarted: nextCombatStarted,
          selected: nextSelected,
          round: nextRound,
          health: nextHealth,
          deathSaves: nextDeathSaves,
        } satisfies CombatStorageData)
      )
    },
    [STORAGE_KEY]
  )

  // Pick up encounter where it left off OR from the start
  useEffect(() => {
    if (loadingSavedData) {
      if (resume) {
        const raw = localStorage.getItem(STORAGE_KEY)
        const data = raw
          ? ({ ...defaultStorageData, ...(JSON.parse(raw) as Partial<CombatStorageData>) } as CombatStorageData)
          : defaultStorageData

        setInitiative(data.initiative)
        setCombatStarted(data.combatStarted)
        setSelected(data.selected)
        setRound(data.round)
        setHealth(data.health)
        setDeathSaves(data.deathSaves)
      } else {
        saveDataToStorage(
          initiative,
          combatStarted,
          selected,
          round,
          health,
          deathSaves
        )
      }
      setLoadingSavedData(false)
    }
  }, [
    resume,
    loadingSavedData,
    STORAGE_KEY,
    initiative,
    combatStarted,
    selected,
    round,
    health,
    deathSaves,
    saveDataToStorage,
  ])

  // Save to storage every time something changes
  useEffect(() => {
    if (!loadingSavedData) {
      saveDataToStorage(
        initiative,
        combatStarted,
        selected,
        round,
        health,
        deathSaves
      )
    }
  }, [
    loadingSavedData,
    initiative,
    combatStarted,
    selected,
    round,
    health,
    deathSaves,
    saveDataToStorage,
  ])

  useEffect(() => {
    if (!encounter) {
      return
    }

    const currentEncounter = encounter
    let active = true
    loadMonsterData()
    return () => {
      active = false
    }

    async function loadMonsterData() {
      const res = await enrichMonsterData(currentEncounter, homebrewMonsters)

      if (!active) {
        return
      }
      setMonsters(res)
    }
  }, [encounter, homebrewMonsters])

  const handleStart = useCallback(() => {
    const nextHealth: HealthState = {}
    const unSetInitiative: InitiativeState = {}

    entries.forEach((entry) => {
      // set health for each entry
      if (entry.isMonster) {
        const monster = monsters.find((m) => m.id === entry.id)
        const avgHp = toNumber(monster?.averageHitPoints)

        nextHealth[getId(entry)] = {
          current: avgHp,
          max: avgHp,
        }
      } else {
        const playerHealth = toNumber(entry.health)
        nextHealth[getId(entry)] = {
          current: playerHealth,
          max: playerHealth,
        }
      }

      // Set 0 for initiative for all entries without
      if (!initiative[getId(entry)]) {
        unSetInitiative[getId(entry)] = 0
      }
    })

    setInitiative({
      ...initiative,
      ...unSetInitiative,
    })
    setHealth(nextHealth)
    setCombatStarted(true)
    setSelected(0)
  }, [monsters, initiative, entries])

  const handleInitiativeUpdate = useCallback(
    (e: ChangeEvent<HTMLInputElement>, id: string) => {
      setInitiative({ ...initiative, [id]: e.target.value })
    },
    [initiative]
  )

  const findNextIndex = useCallback(
    (index: number | null): number => {
      if (entries.length === 0) {
        return 0
      }

      let attempts = 0
      let nextIndex = index === null || index >= entries.length - 1 ? 0 : index + 1

      while (attempts < entries.length) {
        const idOfNextEntry = getId(entries[nextIndex])
        const healthOfNextEntry = health[idOfNextEntry]?.current ?? 0

        if (healthOfNextEntry > 0) {
          return nextIndex
        }

        nextIndex = nextIndex >= entries.length - 1 ? 0 : nextIndex + 1
        attempts += 1
      }

      return nextIndex
    },
    [entries, health]
  )

  const handleNext = useCallback(() => {
    const nextIndex = findNextIndex(selected)

    if (selected !== null && nextIndex <= selected) {
      setRound(round + 1)
    }

    setSelected(nextIndex)
  }, [selected, round, findNextIndex])

  const updateHealth = useCallback(
    (healthEntry: string) => {
      setUpdatedHP(0)
      if (modifyHPModal === healthEntry) {
        showModifyHPModal(null)
      } else {
        showModifyHPModal(healthEntry)
      }
    },
    [modifyHPModal]
  )

  const captureUpdatedHP = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!modifyHPModal) {
        return
      }

      const healthItem = health[modifyHPModal]
      if (!healthItem) {
        return
      }

      const updatedCurrent = toNumber(healthItem.current) + toNumber(updatedHP)

      setHealth({
        ...health,
        [modifyHPModal]: {
          ...healthItem,
          current: updatedCurrent >= 0 ? updatedCurrent : 0,
        },
      })
      setUpdatedHP(0)
      showModifyHPModal(null)

      if (updatedCurrent > 0 && deathSaves[modifyHPModal]) {
        setDeathSaves({
          ...deathSaves,
          [modifyHPModal]: null,
        })
      }
    },
    [health, modifyHPModal, updatedHP, deathSaves]
  )

  const captureDeathSave = useCallback(
    (id: string, type: DeathSaveType) => {
      const currentFailure = deathSaves[id]?.failure || 0
      const updatedFailure =
        type === DEATH_SAVES.FAILURE ? currentFailure + 1 : currentFailure
      const currentSuccess = deathSaves[id]?.success || 0
      const updatedSuccess =
        type === DEATH_SAVES.SUCCESS ? currentSuccess + 1 : currentSuccess

      // No need to capture the update, we've hit the max for the type
      if (
        (type === DEATH_SAVES.FAILURE && updatedFailure > 3) ||
        (type === DEATH_SAVES.SUCCESS && updatedSuccess > 3)
      ) {
        return
      }

      setDeathSaves({
        ...deathSaves,
        [id]: {
          failure: updatedFailure,
          success: updatedSuccess,
        },
      })
    },
    [deathSaves]
  )

  if (loading) {
    return <></>
  }

  return (
    <section data-color-mode={wysiwygMode}>
      {encounter ? (
        <>
          <h1 className="text-base-content font-semibold text-lg mb-2">
            {encounter.name}
          </h1>
          <div className="grid grid-cols-[0.5fr_1fr] gap-2">
            <div>
              <EntriesList
                entries={entries}
                monsters={monsters}
                selected={selected}
                combatStarted={combatStarted}
                health={health}
                getId={getId}
                initiative={initiative}
                handleInitiativeUpdate={handleInitiativeUpdate}
                showMonsterCard={showMonsterCard}
                updateHealth={updateHealth}
                deathSaves={deathSaves}
                captureDeathSave={captureDeathSave}
                DEATH_SAVES={DEATH_SAVES}
                modifyHPModal={modifyHPModal}
                captureUpdatedHP={captureUpdatedHP}
                updatedHP={updatedHP}
                setUpdatedHP={setUpdatedHP}
              />
              <div>
                {combatStarted ? (
                  <div className="flex justify-between">
                    <p className="text-base-content text-xs">Round: {round}</p>
                    {entries.length > 0 && (
                      <button
                        className="btn btn-xs btn-success"
                        type="button"
                        onClick={handleNext}
                      >
                        Next
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    className="btn btn-sm btn-success mt-4"
                    type="button"
                    onClick={handleStart}
                  >
                    Start encounter
                  </button>
                )}
              </div>
            </div>
            <div>
              {monsterCard && <MonsterCard monster={monsterCard.monster} />}
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

export default CombatTracker
