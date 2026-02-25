export const MONSTER_ACTION = {
  ADD: 'add',
  REMOVE: 'remove',
} as const

export type MonsterAction = (typeof MONSTER_ACTION)[keyof typeof MONSTER_ACTION]
