import type { Dispatch, SetStateAction } from "react"
import type { Encounter, Monster } from "../../types/domain"

type MonsterItemProps = {
  monsterId: string
  monsterCard: Monster | null
  showMonsterCard: Dispatch<SetStateAction<Monster | null>>
  monster: Monster
  encounter: Encounter
}

const MonsterItem = ({
  monsterId,
  monsterCard,
  showMonsterCard,
  monster,
  encounter,
}: MonsterItemProps) => (
  <li key={monsterId}>
    <button
      className={`cursor-pointer w-full text-left card bg-base-100 ${monsterCard?.id === monsterId ? "border-accent" : "border-base-300"
        } card-border card-sm mb-2 shadow-xs`}
      type="button"
      onClick={() => showMonsterCard(monster)}
    >
      <div className="card-body py-2 px-4 flex flex-row items-center">
        <div className="grow">
          <p className="text-base-content text-base">{monster.name}</p>
          <p className="text-base-content grow-0 text-sm">
            {monster.size} {monster.type}
          </p>
        </div>
        {encounter?.amounts?.[monsterId] > 1 && (
          <p className="flex-none font-semibold text-base-content text-base">
            x {encounter?.amounts?.[monsterId]}
          </p>
        )}
      </div>
    </button>
  </li>
)

export default MonsterItem
