import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEncountersContext } from "../../context/encounters/encounters-context";
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
                <p>Made for fun with love so that I can run encounters at my table without relying on third party vendors.</p>
                <p>Or pen and paper, god forbid.</p>
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
                                        <p className="encounter-name">{encounter.name}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No encounters added yet!</p>
                )}
            </section>
            <section>
                <p>Remaining work I'd like to get to (in no particular order):</p>
                <ul>
                    <li>iOS polish (select styling, etc)</li>
                    <li>Basic Combat tracker</li>
                    <li>Add dynamic links to spells/conditions/other curious things</li>
                    <li>Images (for players and monsters)</li>
                </ul>
            </section>
        </div>
    )
}

export default Home
