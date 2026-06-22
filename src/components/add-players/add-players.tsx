import { usePlayerContext } from "../../context/players/players-context"
import { ENCOUNTER_ACTION, type EncounterAction } from "../../containers/modify-encounter/constants"
import { useCallback } from "react"
import type { Player } from "../../types/domain"

type AddPlayerProps = {
    onSelect?: (arg1: EncounterAction, arg2: string) => void
    selectedPlayers: string[]
}

const AddPlayers = ({ onSelect, selectedPlayers }: AddPlayerProps) => {
    const { players } = usePlayerContext()

    const handleAdd = useCallback(
        (player: Player) => {
            onSelect?.(ENCOUNTER_ACTION.ADD, player.id)
        },
        [onSelect]
    )

    const handleRemove = useCallback(
        (player: Player) => {
            onSelect?.(ENCOUNTER_ACTION.REMOVE, player.id)
        },
        [onSelect]
    )

    return (
        <>
            {players.length > 0 && (
                <div className="mt-4">
                    <p className="block text-sm text-base-content">Players:</p>
                    <ul className="mt-2">
                        {players.map((player) => {
                            const selected = selectedPlayers.includes(player.id)
                            return (
                                <li
                                    key={player.id}
                                    className={`card bg-base-100 card-border card-sm mb-2 shadow-xs ${selected ? "border-primary" : "border-base-300"}`}
                                >
                                    <div
                                        onClick={() => { }}
                                        className="card-body py-2 px-4 flex-row items-center"
                                    >
                                        <div className="flex gap-2 grow items-center">
                                            <p className="grow-0 text-sm text-base-content font-semibold">
                                                {player.name}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <button
                                                type="button"
                                                className="btn btn-xs btn-primary"
                                                onClick={selected ? () => handleRemove(player) : () => handleAdd(player)}
                                            >
                                                {selected ? "- Remove" : "+ Add"}
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </>
    )
}

export default AddPlayers
