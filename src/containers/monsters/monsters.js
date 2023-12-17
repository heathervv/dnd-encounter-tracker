import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMonstersContext } from "../../context/monsters/monsters-context";
import { EXPORT_TYPE, ManageData } from '../../components/manage-data/manage-data';
import './monsters.css'

const Monsters = () => {
    const navigate = useNavigate()
    const { monsters, exportMonsters, importMonsters } = useMonstersContext()

    const handleCreateNew = useCallback(() => {
        navigate('/monster/create')
    }, [navigate])

    return (
        <section className="wrapper">
            <div className="header">
                <h1>List of monsters</h1>
                <button onClick={handleCreateNew}>Create new</button>
            </div>
            {monsters.length > 0 ? (
                <ul className="monster-list">
                    {monsters.map((monster) => (
                        <li key={monster.id}>
                            <Link to={`/monster/${monster.id}`}>
                                <div className="monster-link">
                                    <p className="monster-name">{monster.name}</p>
                                    <p className="monster-type">{monster.size} {monster.type}{monster.alignment ? `, ${monster.alignment}` : ''}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No monsters added yet!</p>
            )}
            <hr />
            <ManageData
                onExport={exportMonsters}
                onImport={importMonsters}
                type={EXPORT_TYPE.MONSTERS}
            />
        </section>
    )
}

export default Monsters
