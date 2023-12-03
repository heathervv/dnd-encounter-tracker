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
        <div>
            <p className="name">{monster.name}</p>
            <p className="subtitle">{monster.size} {monster.type}{monster.alignment ? `, ${monster.alignment}` : ''}</p>
            <ul>
                <li>
                    <p>Armor class:</p>
                    <p>{monster.armorClass} {monster.armorClassType}</p>
                </li>
                <li>
                    <p>Hit points:</p>
                    <p>{monster.averageHitPoints} ({monster.hitPointsDieCount}{monster.hitPointsDieValue} + {monster.hitPointsDieModifier})</p>
                </li>
                <li>
                    <p>Speed:</p>
                    <p>{mapMovement()}
                    </p>
                </li>
            </ul>
            <ul>
                <li>
                    <p>STR</p>
                    <p>{monster.strength} ({mapPrettyAbilityScore(monster.strength)})</p>
                </li>
                <li>
                    <p>DEX</p>
                    <p>{monster.dexterity} ({mapPrettyAbilityScore(monster.dexterity)})</p>
                </li>
                <li>
                    <p>CON</p>
                    <p>{monster.constitution} ({mapPrettyAbilityScore(monster.constitution)})</p>
                </li>
                <li>
                    <p>INT</p>
                    <p>{monster.intelligence} ({mapPrettyAbilityScore(monster.intelligence)})</p>
                </li>
                <li>
                    <p>WIS</p>
                    <p>{monster.wisdom} ({mapPrettyAbilityScore(monster.wisdom)})</p>
                </li>
                <li>
                    <p>CHA</p>
                    <p>{monster.charisma} ({mapPrettyAbilityScore(monster.charisma)})</p>
                </li>
            </ul>
            <ul>
                {monster.savingThrowProficiencies &&
                    <li>
                        <p>Saving throws</p>
                        <p>{mapSavingThrowProficiencies()}</p>
                    </li>
                }
                {
                    monster.skills &&
                    <li>
                        <p>Skills</p>
                        <p>{mapList(monster.skills)}</p>
                    </li>
                }
                {monster.damageVulnerabilities &&
                    <li>
                        <p>Damage Vulnerabilities</p>
                        <p>{monster.damageVulnerabilities}</p>
                    </li>
                }
                {monster.damageResistances &&
                    <li>
                        <p>Damage Resistances</p>
                        <p>{monster.damageResistances}</p>
                    </li>
                }
                {monster.damageImmunities &&
                    <li>
                        <p>Damage Immunities</p>
                        <p>{monster.damageImmunities}</p>
                    </li>
                }
                {
                    monster.conditionImmunities &&
                    <li>
                        <p>Condition Immunities</p>
                        <p>{monster.conditionImmunities}</p>
                    </li>
                }
                <li>
                    <p>Senses</p>
                    <p>
                        {(monster.senses || []).length > 0 &&
                            mapList(monster.senses)
                        } Passive Perception {monster.passivePerception}
                    </p>
                </li>
                {(monster.language || []).length > 0 &&
                    <li>
                        <p>Languages</p>
                        <p>{mapList(monster.language)}</p>
                    </li>
                }
                <li>
                    <p>Challenge</p>
                    <p>{monster.challengeRating}</p>
                </li>
                <li>
                    <p>Proficiency Bonus</p>
                    <p>+{mapProficiencyBonus()}</p>
                </li>
            </ul>
            {monster.specialTraits &&
                <div>
                    <MDEditor.Markdown source={monster.specialTraits} />
                </div>
            }
            {monster.actionsDescription &&
                <div>
                    <h3>Actions</h3>
                    <MDEditor.Markdown source={monster.actionsDescription} />
                </div>
            }
            {monster.bonusActionsDescription &&
                <div>
                    <h3>Bonus Actions</h3>
                    <MDEditor.Markdown source={monster.bonusActionsDescription} />
                </div>
            }
            {monster.reactionsDescription &&
                <div>
                    <h3>Reactions</h3>
                    <MDEditor.Markdown source={monster.reactionsDescription} />
                </div>
            }
            {monster.isLegendary && monster.legendaryActionsDescription &&
                <div>
                    <h3>Legendary Actions</h3>
                    <MDEditor.Markdown source={monster.legendaryActionsDescription} />
                </div>
            }
            {monster.isMythic && monster.mythicActionsDescription &&
                <div>
                    <h3>Mythical Actions</h3>
                    <MDEditor.Markdown source={monster.mythicActionsDescription} />
                </div>
            }
        </div>
    )
}

export default MonsterCard