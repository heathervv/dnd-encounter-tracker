import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEncountersContext } from '../../context/encounters/encounters-context'
import './home.css'

const Home = () => {
    const navigate = useNavigate()
    const { encounters } = useEncountersContext()

    const handleCreateNew = useCallback(() => {
        navigate('/encounter/create')
    }, [navigate])

    return (
        <div className="wrapper">
            <section>
                <h1>A custom DND combat creation/tracker tool.</h1>
                <p>
                    A free-to-use, basic encounter creation and management tool.
                    Stores all data in your browser.
                </p>
            </section>
            <hr />
            <section>
                <div className="header">
                    <h3>List of encounters</h3>
                    <button onClick={handleCreateNew}>Create new</button>
                </div>
                {encounters.length > 0 ? (
                    <ul className="encounters-list">
                        {encounters.map((encounter) => (
                            <li key={encounter.id}>
                                <Link to={`/encounter/${encounter.id}`}>
                                    <div className="encounter-link">
                                        <p className="encounter-name">
                                            {encounter.name}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="empty">
                        You have not created any encounters yet.
                    </p>
                )}
            </section>
        </div>
    )
}

export default Home
