export type ListItem = {
  id?: string
  name: string
  note?: string | number
}

export type SavingThrowProficiency = {
  id?: string
  ability: string
}

export interface Monster {
  id: string
  name: string
  type: string
  size: string
  alignment?: string
  aligment?: string
  challengeRating: number | string
  specialTraits?: string
  actionsDescription?: string
  reactionsDescription?: string
  monsterCharacteristicsDescription?: string
  bonusActionsDescription?: string
  isLegendary: boolean
  legendaryActionsDescription?: string
  isMythic?: boolean
  mythicActionsDescription?: string
  hasLair?: boolean
  lairActionsDescription?: string
  armorClass: number | string
  armorClassType?: string
  passivePerception: number | string
  hitPointsDieCount: number | string
  hitPointsDieValue: string
  hitPointsDieModifier: number | string
  averageHitPoints: number | string
  strength: number | string
  dexterity: number | string
  constitution: number | string
  intelligence: number | string
  wisdom: number | string
  charisma: number | string
  savingThrowProficiencies: SavingThrowProficiency[]
  damageVulnerabilities?: string
  damageResistances?: string
  damageImmunities?: string
  conditionImmunities?: string
  language: ListItem[]
  senses: ListItem[]
  skills: ListItem[]
  movement: ListItem[]
}

export interface Player {
  id: string
  name: string
  level: number | null
  initiative_bonus: number | null
  armor_class: number | null
  speed: number | null
  passive_perception: number | null
  health: number | null
}

export interface Encounter {
  id: string
  name: string
  description?: string
  monsters: string[]
  amounts: Record<string, number>
}
