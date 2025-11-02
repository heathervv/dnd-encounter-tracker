import { useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { usePlayerContext } from "../../context/players/players-context"

const Players = () => {
  const navigate = useNavigate()
  const { players } = usePlayerContext()

  const handleCreateNew = useCallback(() => {
    navigate("/player/create")
  }, [navigate])

  return (
    <section className="max-w-4xl m-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-base-content font-semibold text-lg">
            List of player characters
          </h1>
          <p className="text-base-content">Manage your tables PCs.</p>
        </div>
        <button className="btn btn-xs btn-primary" onClick={handleCreateNew}>
          Create new
        </button>
      </div>
      {players.length > 0 ? (
        <ul className="mt-4">
          {players.map((player) => (
            <li
              key={player.id}
              className="card bg-base-100 card-border border-base-300 card-sm mb-2 shadow-xs"
            >
              <Link to={`/player/${player.id}`}>
                <div className="card-body py-2 px-4 gap-0">
                  <p className="text-base-content text-sm">{player.name}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 card bg-base-100 card-border border-base-300 card-sm">
          <p className="card-body py-2 px-4 gap-0 text-base-content text-sm italic">
            You have not created any player characters yet.
          </p>
        </div>
      )}
    </section>
  )
}

export default Players
