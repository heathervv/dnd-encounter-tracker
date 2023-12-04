export const baseAbilityScoreModifier = (ability) => Math.floor((ability - 10) / 2)

export const mapProficiencyBonus = (challengeRating) => (
    Math.round(1 + (challengeRating / 4))
)