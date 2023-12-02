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
        <>
            <section>
                <h1>A custom DND combat creation/tracker tool.</h1>
                <p>Remaining work (in no particular order):</p>
                <ul>
                    <li>Create new encounter - UI.</li>
                    <li>Single encounter view - UI.</li>
                    <li>Create new monster - UI.</li>
                    <li>Single monster view - UI.</li>
                    <li>Basic Combat tracker.</li>
                </ul>
                <p>NTH work to follow up:</p>
                <ul>
                    <li>General sort of UI polish ??</li>
                    <li>Add dynamic links to spells/conditions/other curious things</li>
                    <li>Images (for players and monsters)</li>
                </ul>
            </section>
            <section>
                <div className="header">
                    <h1>List of encounters</h1>
                    <button onClick={handleCreateNew}>Create new</button>
                </div>
                {encounters.length > 0 ? (
                    <ul>
                        {encounters.map((encounter) => (
                            <li key={encounter.id}>
                                <Link to={`/encounter/${encounter.id}`}>{encounter.name}</Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No encounters added yet!</p>
                )}
            </section>
        </>
    )
}

export default Home
