// Map a single monster from the API to the supported format.
const parseSkills = (initialSkills) => {
    const parsedSenses = []
    Object.entries(initialSkills).forEach(([key, value]) => {
        if (key === 'passive_perception') {
            return
        }
        parsedSenses.push({
            name: key,
            note: value
        })
    })

    return parsedSenses
}

const PROFICIENCY_TYPE = {
    SKILL: 'skill',
    SAVING_THROW: 'saving-throw'
}

const SHORTFORM_ABILITIES = {
    DEX: 'dexterity',
    CON: 'constitution',
    WIS: 'wisdom',
    CHA: 'charisma',
    INT: 'intelligence',
    STR: 'strength'
}

const parseProficiencies = (proficiencies, type) => {
    const filtered = proficiencies.filter((skill) => skill.proficiency.index.includes(type))
    const parsed = filtered.map((skill) => {
        if (type === PROFICIENCY_TYPE.SAVING_THROW) {
            return ({
                ability: SHORTFORM_ABILITIES[skill.proficiency.name.split(': ')[1]],
            })
        }

        return ({
            name: skill.proficiency.name.split(': ')[1],
            note: `+${skill.value}`
        })
    })

    return parsed
}

const formatUsage = (usage) => {
    if (usage.times) {
        return `${usage.times} ${usage.type}`
    }

    if (usage.dice) {
        return `${usage.type} ${usage.dice} min: ${usage.min_value}`
    }

    return ''
}

const parseActionEconomy = (section) => {
    if (!section) return

    const markdown = section.map((item) => `**${item.name}${item.usage ? ` (${formatUsage(item.usage)})` : ''}** ${item.desc}`)

    return markdown.join('<br ><br >')
}

export const mapApiResponseToSupportedFormat = (response) => (
    {
        // Base info
        id: response.index,
        name: response.name,
        type: response.type,
        size: response.size,
        aligment: response.alignment,
        challengeRating: response.challenge_rating,

        // HP
        hitPointsDieCount: response.hit_dice.split('d')[0],
        hitPointsDieValue: `d${response.hit_dice.split('d')[1]}`,
        hitPointsDieModifier: response.hit_points_roll.split('+')[1],
        averageHitPoints: response.hit_points,

        // Ability scores
        strength: response.strength,
        dexterity: response.dexterity,
        constitution: response.constitution,
        intelligence: response.intelligence,
        wisdom: response.wisdom,
        charisma: response.charisma,

        // Armor
        armorClass: response.armor_class[0]?.value,
        armorClassType: `(${response.armor_class[0]?.type})`,

        // Base abilities
        language: response.languages.split(', ').map((lang) => ({ name: lang })),
        senses: parseSkills(response.senses),
        passivePerception: response.senses?.passive_perception,
        skills: parseProficiencies(response.proficiencies, PROFICIENCY_TYPE.SKILL),
        movement: Object.entries(response.speed).map(([key, value]) => ({
            name: key,
            note: value
        })),

        // Proficiencies
        savingThrowProficiencies: parseProficiencies(response.proficiencies, PROFICIENCY_TYPE.SAVING_THROW),
        damageVulnerabilities: response.damage_vulnerabilities.join(', '),
        damageResistances: response.damage_resistances.join(', '),
        damageImmunities: response.damage_immunities.join(', '),
        conditionImmunities: response.condition_immunities.map((ci) => ci.name).join(', '),

        // Action economy
        // Note: this is not all the supported options (we also support Bonus, Mythic, and Lair actions)
        // but it would seem the API doesn't return those properties, so there's nothing to map.
        // @TODO(): is it possible to map spells here into links of some sort?
        specialTraits: parseActionEconomy(response.special_abilities),
        actionsDescription: parseActionEconomy(response.actions),
        reactionsDescription: parseActionEconomy(response.reactions),
        isLegendary: response.legendary_actions !== null,
        legendaryActionsDescription: parseActionEconomy(response.legendary_actions)
    }
)