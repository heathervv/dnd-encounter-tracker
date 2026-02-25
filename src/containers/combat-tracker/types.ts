import type { Monster, Player } from "../../types/domain"

export type MonsterEntry = {
  id: string
  isMonster: true
  kind: number
}

export type PlayerEntry = Player & {
  isMonster?: false
}

export type CombatEntry = MonsterEntry | PlayerEntry

export type InitiativeState = Record<string, number | string>

export type HealthState = Record<string, { current: number; max: number }>

export type DeathSaveValue = { failure: number; success: number }

export type DeathSaveState = Record<string, DeathSaveValue | null>

export type MonsterCardData = {
  monster: Monster
  kind: number
}

export type CombatStorageData = {
  initiative: InitiativeState
  combatStarted: boolean
  selected: number | null
  round: number
  health: HealthState
  deathSaves: DeathSaveState
}

export type DeathSaveType = "success" | "failure"
