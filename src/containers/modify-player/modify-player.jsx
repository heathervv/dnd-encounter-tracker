import { useCallback, useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { usePlayerContext } from '../../context/players/players-context'
import './modify-player.css'

const ModifyPlayer = ({ isEdit }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getSinglePlayer, createPlayer, updatePlayer } = usePlayerContext()
    const [form, setForm] = useState({
        name: '',
        level: null,
        initiative_bonus: null,
        armor_class: null,
        speed: null,
        passive_perception: null,
        health: null,
    })

    const player = useMemo(() => getSinglePlayer?.(id), [id, getSinglePlayer])

    useEffect(() => {
        if (player) {
            setForm(player)
        }
    }, [player])

    const handleFieldChange = (e, name) => {
        const value = e?.target ? e?.target.value : e
        setForm({ ...form, [name]: value })
    }

    const handleSave = useCallback(
        (e) => {
            e?.preventDefault()
            const id = isEdit ? player.id : uuidv4()

            const playerData = {
                ...form,
                id,
            }

            if (isEdit) {
                updatePlayer(playerData)
            } else {
                createPlayer(playerData)
            }

            navigate(`/player/${id}`)
        },
        [isEdit, player, form, createPlayer, updatePlayer, navigate]
    )

    return (
        <section className="wrapper" data-color-mode="light">
            <h1>
                {isEdit ? `Edit ${player?.name}` : 'Create player character'}
            </h1>
            <form onSubmit={handleSave}>
                <div className="row">
                    <label>
                        Name*:{' '}
                        <input
                            type="text"
                            required
                            name="name"
                            value={form.name}
                            onChange={(e) => handleFieldChange(e, 'name')}
                        />
                    </label>
                </div>
                <div className="row">
                    <label>
                        Level*:{' '}
                        <input
                            type="number"
                            required
                            name="level"
                            value={form.level}
                            onChange={(e) => handleFieldChange(e, 'level')}
                        />
                    </label>
                    <label>
                        Initiative bonus*:{' '}
                        <input
                            type="number"
                            required
                            name="initiative_bonus"
                            value={form.initiative_bonus}
                            onChange={(e) =>
                                handleFieldChange(e, 'initiative_bonus')
                            }
                        />
                    </label>
                </div>
                <div className="row">
                    <label>
                        Armor Class*:{' '}
                        <input
                            type="number"
                            required
                            name="armor_class"
                            value={form.armor_class}
                            onChange={(e) =>
                                handleFieldChange(e, 'armor_class')
                            }
                        />
                    </label>
                    <label>
                        Speed*:{' '}
                        <input
                            type="number"
                            required
                            name="speed"
                            value={form.speed}
                            onChange={(e) => handleFieldChange(e, 'speed')}
                        />
                    </label>
                </div>
                <div className="row">
                    <label>
                        Passive Perception*:{' '}
                        <input
                            type="number"
                            required
                            name="passive_perception"
                            value={form.passive_perception}
                            onChange={(e) =>
                                handleFieldChange(e, 'passive_perception')
                            }
                        />
                    </label>
                    <label>
                        Health points*:{' '}
                        <input
                            type="number"
                            required
                            name="health"
                            value={form.health}
                            onChange={(e) => handleFieldChange(e, 'health')}
                        />
                    </label>
                </div>
                <hr />
                <button className="save" type="submit">
                    {isEdit ? 'Save changes' : 'Create player character'}
                </button>
            </form>
        </section>
    )
}

export default ModifyPlayer
