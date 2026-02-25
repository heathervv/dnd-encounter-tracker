import { useCallback, useEffect, useMemo, useState } from "react"
import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react"

import { fetchMonsters, fetchSpecificMonster } from "../../api/dnd-api"
import MonsterCard from "../../containers/view-monster/monster-card"
import { useMonstersContext } from "../../context/monsters/monsters-context"
import { MONSTER_ACTION } from "../../containers/modify-encounter/modify-encounter"
import type { SimpleMonsterResponse } from "../../api/types"
import type { Monster } from "../../types/domain"

type Props = {
  name: string,
  homebrew: boolean,
  monster: MonsterListItem,
  selected?: number,
  onSelect?: (arg1: MONSTER_ACTION, arg2: string, arg3?: number) => void
}

type HomebrewMonsterListItem = Monster & {
  homebrew: true
  hidden: boolean
}

type ApiMonsterListItem = SimpleMonsterResponse & {
  homebrew: false
  hidden: boolean
}

type MonsterListItem = HomebrewMonsterListItem | ApiMonsterListItem

type AddMonsterProps = {
  onSelect?: (arg1: MONSTER_ACTION, arg2: string, arg3?: number) => void
  selectedMonsters: string[]
  selectedAmount: Record<string, number>
}

const getMonsterId = (monster: MonsterListItem): string =>
  monster.homebrew ? monster.id : monster.index

const MonsterItem = ({ name, homebrew, monster, selected = 0, onSelect }: Props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false)
  const [monsterData, setMonsterData] = useState<Monster | null>(null)

  const handleDrawer = useCallback(
    async (e: MouseEvent<HTMLDivElement>) => {
      if (e.target instanceof HTMLElement && e.target.tagName.toLowerCase() === "button") {
        // Drawer should not be altered if a button (add/remove) was pressed
        return
      }

      if (drawerIsOpen) {
        setDrawerIsOpen(false)
        return
      }
      if (!homebrew) {
        const result = await fetchSpecificMonster(getMonsterId(monster))

        setMonsterData(result)
        setDrawerIsOpen(true)
      } else {
        setDrawerIsOpen(true)
      }
    },
    [homebrew, drawerIsOpen, monster]
  )

  const handleAdd = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      onSelect?.(MONSTER_ACTION.ADD, getMonsterId(monster), 1)
    },
    [onSelect, monster]
  )

  const handleRemove = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      onSelect?.(MONSTER_ACTION.REMOVE, getMonsterId(monster))
    },
    [onSelect, monster]
  )

  const handleAmountChange = useCallback(
    (e: MouseEvent<HTMLButtonElement>, value: number) => {
      e.preventDefault()
      onSelect?.(MONSTER_ACTION.ADD, getMonsterId(monster), value || 1)
    },
    [onSelect, monster]
  )

  return (
    <li
      className={`card bg-base-100 card-border card-sm mb-2 shadow-xs ${selected ? "border-primary" : "border-base-300"
        }`}
    >
      <div
        onClick={handleDrawer}
        className="card-body py-2 px-4 flex-row items-center"
      >
        <div className="flex gap-2 grow items-center">
          <p className="grow-0 text-sm text-base-content font-semibold">
            {name}
          </p>
          {homebrew && (
            <p className="grow-0 text-xs italic text-base-content/50">
              Homebrew
            </p>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {selected && (
            <div className="flex items-center">
              <button
                className="bg-neutral text-neutral-content px-2 h-6 cursor-pointer"
                onClick={(e) => handleAmountChange(e, selected - 1)}
              >
                -
              </button>
              <p className="border border-base-content px-2 py-0.5 h-6">
                {selected}
              </p>
              <button
                className="bg-neutral text-neutral-content px-2 h-6 cursor-pointer"
                onClick={(e) => handleAmountChange(e, selected + 1)}
              >
                +
              </button>
            </div>
          )}
          <button
            className="btn btn-xs btn-primary"
            onClick={selected ? handleRemove : handleAdd}
          >
            {selected ? "- Remove" : "+ Add"}
          </button>
          <p className="text-xs">{drawerIsOpen ? "View less" : "View more"}</p>
        </div>
      </div>
      {drawerIsOpen && (
        <MonsterCard
          monster={homebrew ? monster : monsterData}
          className="border-t border-base-content/10 pt-1"
        />
      )}
    </li>
  )
}

const AddMonster = ({ onSelect, selectedMonsters, selectedAmount }: AddMonsterProps) => {
  const { monsters: homebrewMonsters } = useMonstersContext()
  const [apiMonsters, setApiMonsters] = useState<SimpleMonsterResponse[]>([])
  const [searchValue, updateSearchValue] = useState("")

  const listOfMonsters = useMemo<MonsterListItem[]>(() => {
    // It is definitely not ideal to loop through these lists as often as I am
    // to complete this. However the data set it's working with is incredibly
    // small so this is not currently causing any performance issues and I care
    // more about getting something working then it being right (for now).
    // @TODO(): a refactor should still happen though.
    const homebrewCaptured = homebrewMonsters?.map<HomebrewMonsterListItem>((hbm) => ({
      ...hbm,
      homebrew: true as const,
      hidden: Boolean(
        searchValue &&
        !hbm.name.toLowerCase().includes(searchValue.toLowerCase())
      ),
    }))

    const apiMonstersCaptured = apiMonsters.map((am) => ({
      ...am,
      homebrew: false as const,
      hidden: Boolean(
        searchValue &&
        !am.name.toLowerCase().includes(searchValue.toLowerCase())
      ),
    }))

    return [...(homebrewCaptured || []), ...apiMonstersCaptured]
  }, [homebrewMonsters, apiMonsters, searchValue])

  useEffect(() => {
    fetchMonsters().then((response) => {
      setApiMonsters(response.results)
    })
  }, [])

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    updateSearchValue(e.target.value)
  }, [])

  const disableEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      e.preventDefault()
    }
  }

  return (
    <div className="mt-4">
      <p className="block text-sm text-base-content">Monsters:</p>
      <input
        className="input input-sm input-border w-full items-center mt-1 mb-4"
        type="text"
        value={searchValue}
        placeholder="Filter list of monsters..."
        onChange={handleSearch}
        onKeyDown={disableEnter}
      />
      <hr className="my-2 border-base-content/10" />
      <ul>
        {/* Monsters that meet the search criteria AND have been added to the encounter */}
        {listOfMonsters
          .filter(
            (m) => !m.hidden && selectedMonsters.includes(getMonsterId(m))
          )
          .map((monster) => (
            <MonsterItem
              key={getMonsterId(monster)}
              name={monster.name}
              homebrew={monster.homebrew}
              monster={monster}
              selected={selectedAmount[getMonsterId(monster)] || 0}
              onSelect={onSelect}
            />
          ))}
        {/* Monsters that meet the search criteria and HAVE NOT been selected */}
        {listOfMonsters
          .filter(
            (m) => !m.hidden && !selectedMonsters.includes(getMonsterId(m))
          )
          .map((monster) => (
            <MonsterItem
              key={getMonsterId(monster)}
              name={monster.name}
              homebrew={monster.homebrew}
              monster={monster}
              onSelect={onSelect}
            />
          ))}
      </ul>
    </div>
  )
}

export default AddMonster
