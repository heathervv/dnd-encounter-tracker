import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMonstersContext } from '../../context/monsters/monsters-context'

const Monsters = () => {
    const navigate = useNavigate()
    const { monsters } = useMonstersContext()

    const handleCreateNew = useCallback(() => {
        navigate('/monster/create')
    }, [navigate])

    return (
        <section className="wrapper">
            <div className="header">
                <div>
                    <h1>List of homebrew monsters</h1>
                    <p>Manage your own unique monsters.</p>
                </div>
                <button onClick={handleCreateNew}>Create new</button>
            </div>
            {monsters.length > 0 ? (
                <ul className="monster-list">
                    {monsters.map((monster) => (
                        <li key={monster.id}>
                            <Link to={`/monster/${monster.id}`}>
                                <div className="monster-link">
                                    <p className="monster-name">
                                        {monster.name}
                                    </p>
                                    <p className="monster-type">
                                        {monster.size} {monster.type}
                                        {monster.alignment
                                            ? `, ${monster.alignment}`
                                            : ''}
                                    </p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="empty">You have not created any monsters yet.</p>
            )}
        </section>
    )
}

export default Monsters
