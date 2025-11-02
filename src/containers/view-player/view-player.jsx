import { useCallback, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { usePlayerContext } from "../../context/players/players-context"

const Player = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getSinglePlayer, deletePlayer } = usePlayerContext()

  const player = useMemo(() => getSinglePlayer?.(id), [id, getSinglePlayer])

  const handleEdit = useCallback(() => {
    navigate(`/player/${player.id}/edit`)
  }, [player, navigate])

  const handleDelete = useCallback(() => {
    deletePlayer(player.id)
    navigate("/players")
  }, [player, deletePlayer, navigate])

  return (
    <section className="max-w-4xl m-auto">
      {player ? (
        <>
          <div className="flex justify-between items-end">
            <h1 className="text-base-content font-semibold text-lg">
              {player.name}
            </h1>
            <div>
              <button
                className="btn btn-xs btn-primary"
                type="button"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="ml-2 btn btn-xs btn-error"
                type="button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mt-4 card bg-base-100 card-border border-base-300 card-sm mb-2 shadow-xs">
            <ul className="card-body py-2 px-4 gap-2 grid grid-cols-3 grid-rows-2">
              <li>
                <p className="text-sm text-base-content font-semibold">
                  Level:
                </p>
                <p className="text-sm text-base-content">{player.level}</p>
              </li>
              <li>
                <p className="text-sm text-base-content font-semibold">AC:</p>
                <p className="text-sm text-base-content">
                  {player.armor_class}
                </p>
              </li>
              <li>
                <p className="text-sm text-base-content font-semibold">
                  Hit points:
                </p>
                <p className="text-sm text-base-content">{player.health}</p>
              </li>
              <li>
                <p className="text-sm text-base-content font-semibold">
                  Initiative bonus:
                </p>
                <p className="text-sm text-base-content">
                  {player.initiative_bonus}
                </p>
              </li>
              <li>
                <p className="text-sm text-base-content font-semibold">
                  Passive perception:
                </p>
                <p className="text-sm text-base-content">
                  {player.passive_perception}
                </p>
              </li>
              <li>
                <p className="text-sm text-base-content font-semibold">
                  Speed:
                </p>
                <p className="text-sm text-base-content">{player.speed}</p>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div className="mt-4 card bg-base-100 card-border border-base-300 card-sm">
          <p className="card-body py-2 px-4 gap-0 text-base-content text-sm italic">
            Sorry, the requested player character could not be found.
          </p>
        </div>
      )}
    </section>
  )
}

export default Player
