export const ENCOUNTER_ACTION = {
  ADD: 'add',
  REMOVE: 'remove',
} as const

export type EncounterAction = (typeof ENCOUNTER_ACTION)[keyof typeof ENCOUNTER_ACTION]
