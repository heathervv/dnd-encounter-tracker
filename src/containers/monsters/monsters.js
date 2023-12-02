import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMonstersContext } from "../../context/monsters/monsters-context";
import './monsters.css'

const Monsters = () => {
    const navigate = useNavigate()
    const { monsters } = useMonstersContext()

    const handleCreateNew = useCallback(() => {
        navigate('/monster/create')
    }, [navigate])

    return (
        <section>
            <div className="header">
                <h1>List of monsters</h1>
                <button onClick={handleCreateNew}>Create new</button>
            </div>
            {monsters.length > 0 ? (
                <ul>
                    {monsters.map((monster) => (
                        <li key={monster.id}>
                            <Link to={`/monster/${monster.id}`}>{monster.name}</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No monsters added yet!</p>
            )}
        </section>
    )
}

export default Monsters
