type ArmorClass = {
  type: string;
  value: number;
};

export type Sense = string | number;
export type Senses = { string: Sense; passive_perception: number };

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
