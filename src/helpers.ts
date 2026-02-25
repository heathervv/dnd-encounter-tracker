import { fetchSpecificMonster } from './api/dnd-api'
import type { Encounter, Monster } from './types/domain'

export const baseAbilityScoreModifier = (ability: number): number =>
    Math.floor((ability - 10) / 2)

const cr_proficiency_bonus: Record<number, number> = {
    0: 2,
    0.125: 2, // 1/8
    0.25: 2, // 1/4
    0.5: 2,
    1: 2,
    2: 2,
    3: 2,
    4: 2,
    5: 3,
    6: 3,
    7: 3,
    8: 3,
    9: 4,
    10: 4,
    11: 4,
    12: 4,
    13: 5,
    14: 5,
    15: 5,
    16: 5,
    17: 6,
    18: 6,
    19: 6,
    20: 6,
    21: 7,
    22: 7,
    23: 7,
    24: 7,
    25: 8,
    26: 8,
    27: 8,
    28: 8,
    29: 9,
    30: 9,
}

type LegacyNavigator = Navigator & {
    msSaveOrOpenBlob?: (blob: Blob, defaultName?: string) => boolean
}

export const mapProficiencyBonus = (challengeRating: number): number =>
    cr_proficiency_bonus[challengeRating] ?? 2

export const exportToJson = (data: unknown, fileName = 'export'): void => {
    const filename = `${fileName}.json`
    const contentType = 'application/json;charset=utf-8;'
    const legacyNavigator = window.navigator as LegacyNavigator

    if (legacyNavigator.msSaveOrOpenBlob) {
        const blob = new Blob(
            [decodeURIComponent(encodeURI(JSON.stringify(data)))],
            { type: contentType }
        )

        legacyNavigator.msSaveOrOpenBlob(blob, filename)
    } else {
        const a = document.createElement('a')
        a.download = filename
        a.href =
            'data:' +
            contentType +
            ',' +
            encodeURIComponent(JSON.stringify(data))
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
}

export const toTitleCase = (str: string): string =>
    str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )

export const enrichMonsterData = async (encounter: Encounter, homebrewMonsters: Monster[]) =>
    await Promise.all(
        encounter.monsters.map(async (monster) => {
            const monsterIsHomebrew = homebrewMonsters.find(
                (m) => m.id === monster
            )

            if (monsterIsHomebrew) {
                return monsterIsHomebrew
            }

            return await fetchSpecificMonster(monster)
        })
    )

export const toNumber = (value: number | string | null | undefined): number =>
  Number(value || 0)
