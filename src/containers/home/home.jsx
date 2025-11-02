import { useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useEncountersContext } from "../../context/encounters/encounters-context"

const Home = () => {
  const navigate = useNavigate()
  const { encounters } = useEncountersContext()

  const handleCreateNew = useCallback(() => {
    navigate("/encounter/create")
  }, [navigate])

  return (
    <div className="max-w-4xl m-auto">
      <section className="mb-4 alert alert-dash alert-warning">
        <div>
          <h1 className="text-base-content font-semibold text-lg">
            A custom DND combat creation/tracker tool.
          </h1>
          <p className="text-base-content">
            Basic encounter creation and management tool. Free-to-use, keeps all
            your data safe in your browser.
          </p>
        </div>
      </section>
      <section>
        <div className="flex justify-between items-end">
          <h3 className="text-base-content font-semibold">
            List of encounters
          </h3>
          <button className="btn btn-xs btn-primary" onClick={handleCreateNew}>
            Create new
          </button>
        </div>
        {encounters.length > 0 ? (
          <ul className="mt-4">
            {encounters.map((encounter) => (
              <li
                key={encounter.id}
                className="card bg-base-100 card-border border-base-300 card-sm mb-2 shadow-xs"
              >
                <Link to={`/encounter/${encounter.id}`}>
                  <div className="card-body py-2 px-4">
                    <p className="text-base-content text-sm">
                      {encounter.name}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 card bg-base-100 card-border border-base-300 card-sm">
            <p className="card-body py-2 px-4 gap-0 text-base-content text-sm italic">
              You have not created any encounters yet.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
