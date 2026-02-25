import { toTitleCase } from "../helpers";
import type { Monster } from "../types/domain";
import type {
  Proficiency,
  MonsterResponse,
  Skill,
  Senses,
  Action,
  SpecialAbility,
  Spell,
} from "./types";

// Map a single monster from the API to the supported format.
const parseSkills = (initialSkills: Senses): Skill[] => {
  const parsedSenses: Skill[] = [];
  Object.entries(initialSkills).forEach(([key, value]) => {
    if (key === "passive_perception") {
      return;
    }
    parsedSenses.push({
      name: toTitleCase(key),
      note: value,
    });
  });

  return parsedSenses;
};

const PROFICIENCY_TYPE = {
  SKILL: "skill",
  SAVING_THROW: "saving-throw",
} as const;

const SHORTFORM_ABILITIES = {
  DEX: "dexterity",
  CON: "constitution",
  WIS: "wisdom",
  CHA: "charisma",
  INT: "intelligence",
  STR: "strength",
};

const parseSkillProficiencies = (proficiencies: Proficiency[]) =>
  proficiencies
    .filter((skill) => skill.proficiency.index.includes(PROFICIENCY_TYPE.SKILL))
    .map((skill) => ({
      name: skill.proficiency.name.split(": ")[1],
      note: `+${skill.value}`,
    }));

const parseSavingThrowProficiencies = (proficiencies: Proficiency[]) =>
  proficiencies
    .filter((skill) =>
      skill.proficiency.index.includes(PROFICIENCY_TYPE.SAVING_THROW),
    )
    .map((skill) => {
      const ability = skill.proficiency.name.split(
        ": ",
      )[1] as keyof typeof SHORTFORM_ABILITIES;
      return {
        ability: toTitleCase(SHORTFORM_ABILITIES[ability]),
      };
    });

const formatUsage = (usage: NonNullable<SpecialAbility["usage"]>) => {
  if (usage.times) {
    return `${usage.times} ${usage.type}`;
  }

  if (usage.dice) {
    return `${usage.type} ${usage.dice} min: ${usage.min_value}`;
  }

  if (usage.rest_types) {
    return `Recharge after ${usage.rest_types.join(" or ")} rest`;
  }

  return "";
};

const parseActionEconomy = (
  section: SpecialAbility[] | Action[],
): string | undefined => {
  if (!section || section.length === 0) return;

  const mapSpells = (item: SpecialAbility | Action) => {
    if (!item.spellcasting) {
      return item.desc;
    }

    let enrichedDescription = item.desc;

    (item.spellcasting.spells || []).forEach((spell: Spell) => {
      if (spell.name) {
        enrichedDescription = enrichedDescription?.replace(
          spell.name?.toLowerCase(),
          `[spell]${spell.name?.toLowerCase()}[/spell]`,
        );
      }
    });

    return enrichedDescription;
  };

  const markdown = section.map(
    (item) =>
      `**${item.name}${
        item.usage ? ` (${formatUsage(item.usage)})` : ""
      }** ${mapSpells(item)}`,
  );

  return markdown.join("\n\n");
};

const parseLegendaryActions = (
  name: string,
  actions: Action[],
): string | undefined => {
  const actionEconomy = parseActionEconomy(actions);

  if (actionEconomy) {
    const header = `The ${name} can take 3 legendary actions, choosing from the options below.
            Only one legendary action can be used at a time and only at the end of another creature's turn. 
            The ${name} regains spent legendary actions at the start of its turn.`;

    return `${header}\n\n${actionEconomy}`;
  }

  return actionEconomy;
};

export const mapApiResponseToSupportedFormat = (
  response: MonsterResponse,
): Monster => ({
  // Base info
  id: response.index,
  name: response.name,
  type: response.type,
  size: response.size,
  alignment: response.alignment,
  challengeRating: response.challenge_rating,

  // HP
  hitPointsDieCount: response.hit_dice.split("d")[0] || "0",
  hitPointsDieValue: `d${response.hit_dice.split("d")[1] || "0"}`,
  hitPointsDieModifier: response.hit_points_roll.split("+")[1],
  averageHitPoints: response.hit_points,

  // Ability scores
  strength: response.strength,
  dexterity: response.dexterity,
  constitution: response.constitution,
  intelligence: response.intelligence,
  wisdom: response.wisdom,
  charisma: response.charisma,

  // Armor
  armorClass: response.armor_class[0]?.value ?? 0,
  armorClassType: response.armor_class[0]?.type
    ? `(${response.armor_class[0]?.type})`
    : "",

  // Base abilities
  language: response.languages
    ? response.languages.split(", ").map((lang) => ({ name: lang }))
    : [],
  senses: parseSkills(response.senses),
  passivePerception: response.senses?.passive_perception,
  skills: parseSkillProficiencies(response.proficiencies),
  movement: Object.entries(response.speed).map(([key, value]) => ({
    name: key,
    note: value,
  })),

  // Proficiencies
  savingThrowProficiencies: parseSavingThrowProficiencies(
    response.proficiencies,
  ),
  damageVulnerabilities: toTitleCase(
    response.damage_vulnerabilities.join(", "),
  ),
  damageResistances: toTitleCase(response.damage_resistances.join(", ")),
  damageImmunities: toTitleCase(response.damage_immunities.join(", ")),
  conditionImmunities: toTitleCase(
    response.condition_immunities.map((ci) => ci.name).join(", "),
  ),

  // Action economy
  // Note: this is not all the supported options (we also support Bonus, Mythic, and Lair actions)
  // but it would seem the API doesn't return those properties, so there's nothing to map.
  specialTraits: parseActionEconomy(response.special_abilities),
  actionsDescription: parseActionEconomy(response.actions),
  reactionsDescription: parseActionEconomy(response.reactions),
  isLegendary: response.legendary_actions.length > 0,
  legendaryActionsDescription: parseLegendaryActions(
    response.name,
    response.legendary_actions,
  ),
});
