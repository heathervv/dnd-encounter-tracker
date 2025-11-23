type ArmorClass = {
  type: string;
  value: number;
};

export type Sense = string | number;
export type Senses = { string: Sense; passive_perception: number };

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
  times: number;
  rest_types: [];
  dice: string;
  min_value: number;
};

export type SpecialAbility = {
  damage?: [];
  desc?: string;
  name: string;
  usage?: Usage;
  spellcasting?: {
    spells?: Spell[];
  };
};

export type Action = {
  name?: string;
  desc?: string;
  attack_bonus?: number;
  action_options?: {}[];
  actions: {}[];
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

type Property = {
  ability?: string;
  name?: string;
  note?: string;
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
  speed: { string: string };
  damage_vulnerabilities: string[];
  damage_resistances: string[];
  damage_immunities: string[];
  condition_immunities: { index: string; name: string }[];
  special_abilities: SpecialAbility[];
  actions: Action[];
  reactions: [];
  legendary_actions: [];
};

export type TransformedMonster = {
  id: string;
  name: string;
  type: string;
  size: string;
  aligment: string;
  challengeRating: number;
  hitPointsDieCount: string;
  hitPointsDieValue: string;
  hitPointsDieModifier: string;
  averageHitPoints: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  armorClass: number;
  armorClassType: string;
  language: { name: string }[];
  senses: Skill[];
  passivePerception: number;
  skills: Property[];
  movement: { name: string; note: string }[];
  savingThrowProficiencies: Property[];
  damageVulnerabilities: string;
  damageResistances: string;
  damageImmunities: string;
  conditionImmunities: string;
  specialTraits: string | undefined;
  actionsDescription: string | undefined;
  reactionsDescription: string | undefined;
  isLegendary: boolean;
  legendaryActionsDescription: string | undefined;
};

export type SimpleMonsterResponse = {
  index: string;
  name: string;
  url: string;
  hidden: string;
};

export type SpellDc = {
  dc_success: string;
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
  material: string;
  duration: string;
  higher_level: string[];
  heal_at_slot_level: number;
  school: {
    name: string;
  };
  dc: SpellDc;
  damage: {
    damage_type: {
      name: string;
    };
  };
  area_of_effect: {
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
  material: string;
  duration: string;
  school: string;
  attackSave: string;
  damageType: string;
  description: string;
};
