import { useCallback } from 'react'
import MDEditor from '@uiw/react-md-editor/nohighlight'
import './monster-card.css'

const MonsterCard = ({ monster }) => {
    const mapMovement = useCallback(() => {
        const movements = (monster.movement || []).map((type) => {
            if (type.name.toLowerCase() === 'walk') {
                return type.note
            }

            return `${type.name} ${type.note}`
        })

        return movements.join(', ')
    }, [monster])

    const baseAbilityScoreModifier = (ability) => Math.floor((ability - 10) / 2)

    const mapPrettyAbilityScore = useCallback((ability) => {
        let score = baseAbilityScoreModifier(ability)

        if (score >= 0) {
            score = `+${score}`
        }

        return score
    }, [])

    const mapList = useCallback((attribute) => {
        const map = (attribute || []).map((type) => `${type.name} ${type.note}`)

        return map.join(', ')
    }, [])

    const mapProficiencyBonus = useCallback(() => (
        Math.round(1 + (monster.challengeRating / 4))
    ), [monster])

    const mapSavingThrowProficiencies = useCallback(() => {
        const map = (monster.savingThrowProficiencies || []).map((st) => {
            const abilityScore = monster[st.ability.toLowerCase()]
            const abilityScoreModifier = baseAbilityScoreModifier(abilityScore)
            const totalModifier = abilityScoreModifier + mapProficiencyBonus()

            return `${st.ability} +${totalModifier}`
        })

        return map.join(', ')
    }, [monster, mapProficiencyBonus])

    return (
        <div className="monster-card">
            <div className="card-header">
                <p className="name">{monster.name}</p>
                <p className="subtitle">{monster.size} {monster.type}{monster.alignment ? `, ${monster.alignment}` : ''}</p>
            </div>
            <ul className="section stats">
                <li>
                    <p className="bold">Armor class:</p>
                    <p>{monster.armorClass} {monster.armorClassType}</p>
                </li>
                <li>
                    <p className="bold">Hit points:</p>
                    <p>{monster.averageHitPoints} ({monster.hitPointsDieCount}{monster.hitPointsDieValue} + {monster.hitPointsDieModifier})</p>
                </li>
                <li>
                    <p className="bold">Speed:</p>
                    <p>{mapMovement()}
                    </p>
                </li>
            </ul>
            <ul className="section abilities">
                <li>
                    <p className="bold">STR</p>
                    <p>{monster.strength} ({mapPrettyAbilityScore(monster.strength)})</p>
                </li>
                <li>
                    <p className="bold">DEX</p>
                    <p>{monster.dexterity} ({mapPrettyAbilityScore(monster.dexterity)})</p>
                </li>
                <li>
                    <p className="bold">CON</p>
                    <p>{monster.constitution} ({mapPrettyAbilityScore(monster.constitution)})</p>
                </li>
                <li>
                    <p className="bold">INT</p>
                    <p>{monster.intelligence} ({mapPrettyAbilityScore(monster.intelligence)})</p>
                </li>
                <li>
                    <p className="bold">WIS</p>
                    <p>{monster.wisdom} ({mapPrettyAbilityScore(monster.wisdom)})</p>
                </li>
                <li>
                    <p className="bold">CHA</p>
                    <p>{monster.charisma} ({mapPrettyAbilityScore(monster.charisma)})</p>
                </li>
            </ul>
            <ul className="section stats">
                {monster.savingThrowProficiencies &&
                    <li>
                        <p className="bold">Saving throws</p>
                        <p>{mapSavingThrowProficiencies()}</p>
                    </li>
                }
                {
                    monster.skills &&
                    <li>
                        <p className="bold">Skills</p>
                        <p>{mapList(monster.skills)}</p>
                    </li>
                }
                {monster.damageVulnerabilities &&
                    <li>
                        <p className="bold">Damage Vulnerabilities</p>
                        <p>{monster.damageVulnerabilities}</p>
                    </li>
                }
                {monster.damageResistances &&
                    <li>
                        <p className="bold">Damage Resistances</p>
                        <p>{monster.damageResistances}</p>
                    </li>
                }
                {monster.damageImmunities &&
                    <li>
                        <p className="bold">Damage Immunities</p>
                        <p>{monster.damageImmunities}</p>
                    </li>
                }
                {
                    monster.conditionImmunities &&
                    <li>
                        <p className="bold">Condition Immunities</p>
                        <p>{monster.conditionImmunities}</p>
                    </li>
                }
                <li>
                    <p className="bold">Senses</p>
                    <p>
                        {(monster.senses || []).length > 0 &&
                            mapList(monster.senses)
                        } Passive Perception {monster.passivePerception}
                    </p>
                </li>
                {(monster.language || []).length > 0 &&
                    <li>
                        <p className="bold">Languages</p>
                        <p>{mapList(monster.language)}</p>
                    </li>
                }
                <li className="grouped-stat">
                    <div>
                        <p className="bold">Challenge</p>
                        <p>{monster.challengeRating}</p>
                    </div>
                    <div>
                        <p className="bold">Proficiency Bonus</p>
                        <p>+{mapProficiencyBonus()}</p>
                    </div>
                </li>
            </ul>
            {monster.specialTraits &&
                <div>
                    <div className="wmde-markdown-var"> </div>
                    <MDEditor.Markdown source={monster.specialTraits} className="markdown-block" />
                </div>
            }
            {monster.actionsDescription &&
                <div>
                    <h3 className="section-title">Actions</h3>
                    <MDEditor.Markdown source={monster.actionsDescription} />
                </div>
            }
            {monster.bonusActionsDescription &&
                <div>
                    <h3 className="section-title">Bonus Actions</h3>
                    <MDEditor.Markdown source={monster.bonusActionsDescription} />
                </div>
            }
            {monster.reactionsDescription &&
                <div>
                    <h3 className="section-title">Reactions</h3>
                    <MDEditor.Markdown source={monster.reactionsDescription} />
                </div>
            }
            {monster.isLegendary && monster.legendaryActionsDescription &&
                <div>
                    <h3 className="section-title">Legendary Actions</h3>
                    <MDEditor.Markdown source={monster.legendaryActionsDescription} />
                </div>
            }
            {monster.isMythic && monster.mythicActionsDescription &&
                <div>
                    <h3 className="section-title">Mythical Actions</h3>
                    <MDEditor.Markdown source={monster.mythicActionsDescription} />
                </div>
            }
        </div>
    )
}

export default MonsterCard