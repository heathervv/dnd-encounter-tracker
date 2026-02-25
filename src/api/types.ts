import type { Monster } from "../types/domain";

type ArmorClass = {
  type: string;
  value: number;
};

export type Sense = string | number;
export type Senses = Record<string, Sense> & { passive_perception: number };

export type Skill = {
  name: string;
  note: Sense;
};

export type Spell = {
  name?: string;
  level?: number;
};

export type Usage = {
  type: string;
  times?: number;
  rest_types?: string[];
  dice?: string;
  min_value?: number;
};

export type SpecialAbility = {
  damage?: unknown[];
  desc?: string;
  name: string;
  usage?: Usage;
  spellcasting?: {
    spells?: Spell[];
  };
};

export type Action = {
  name: string;
  desc?: string;
  attack_bonus?: number;
  action_options?: Array<Record<string, unknown>>;
  actions?: Array<Record<string, unknown>>;
  usage?: Usage;
  spellcasting?: {
    spells?: Spell[];
  };
};

export type Proficiency = {
  value: number;
  proficiency: {
    index: string;
    name: string;
  };
};

export type MonsterResponse = {
  index: string;
  name: string;
  type: string;
  size: string;
  alignment: string;
  challenge_rating: number;
  hit_dice: string;
  hit_points_roll: string;
  hit_points: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  armor_class: ArmorClass[];
  languages: string;
  senses: Senses;
  proficiencies: Proficiency[];
  speed: Record<string, string>;
  damage_vulnerabilities: string[];
  damage_resistances: string[];
  damage_immunities: string[];
  condition_immunities: Array<{ index: string; name: string }>;
  special_abilities: SpecialAbility[];
  actions: Action[];
  reactions: Action[];
  legendary_actions: Action[];
};

export type TransformedMonster = Monster;

export type SimpleMonsterResponse = {
  index: string;
  name: string;
  url: string;
  hidden?: boolean;
};

export type SpellDc = {
  dc_success?: string;
  dc_type: {
    index: string;
    name: string;
  };
};

export type SpellResponse = {
  name: string;
  desc: string[];
  level: number;
  casting_time: string;
  concentration: boolean;
  components: string[];
  material?: string;
  duration: string;
  higher_level?: string[];
  heal_at_slot_level?: Record<string, string>;
  school: {
    name: string;
  };
  dc?: SpellDc;
  damage?: {
    damage_type?: {
      name: string;
    };
  };
  area_of_effect?: {
    type: string;
    size: number;
  };
  range: string;
};

export type TransformedSpell = {
  name: string;
  level: string;
  castingTime: string;
  concentration: boolean;
  range: string;
  components: string[];
  material?: string;
  duration: string;
  school: string;
  attackSave: string;
  damageType: string;
  description: string;
};
