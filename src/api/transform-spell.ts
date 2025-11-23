import type { SpellDc, SpellResponse, TransformedSpell } from "./types";

const parseLevel = (level: number): string => {
  const levels = {
    0: "Cantrip",
    1: "1st",
    2: "2nd",
    3: "3rd",
    4: "4th",
    5: "5th",
    6: "6th",
    7: "7th",
    8: "8th",
    9: "9th",
  };

  return levels[level];
};

const parseRange = (response: SpellResponse) => {
  if (response.area_of_effect) {
    return `${response.range} (${response.area_of_effect.size}ft ${response.area_of_effect.type})`;
  }

  return response.range;
};

const parseSave = (dc: SpellDc) => {
  if (!dc) {
    return "None";
  }

  return `${dc.dc_type.name} Save`;
};

const parseDamageType = (response: SpellResponse) => {
  if (response.heal_at_slot_level) {
    return "Healing";
  }

  if (response.damage) {
    return response.damage.damage_type.name;
  }

  return "None";
};

const parseDescription = (response: SpellResponse) => {
  const description = [...response.desc];
  if (response.higher_level && response.higher_level.length > 0) {
    description.push(
      `**Using a higher-level spell slot.** ${response.higher_level.join("\n")}`
    );
  }

  // This is a bit hacky, but it's necessary to support tables.
  // While rendering a table, there must be only ONE new line between each line or the table will break
  // But there MUST be two new lines around the table, or else the markdown tool will continue adding
  // content into the table.
  return description
    .map((line) => {
      const startOfLine = line.substring(0, 2);

      if (startOfLine === "| " || startOfLine === "|-") {
        return `\n${line}`;
      }

      return `\n\n${line}`;
    })
    .join("");
};

export const mapApiResponseToSupportedFormat = (response: SpellResponse): TransformedSpell => ({
  name: response.name,
  level: parseLevel(response.level),
  castingTime: response.casting_time,
  concentration: response.concentration,
  range: parseRange(response),
  components: response.components,
  material: response.material,
  duration: response.duration,
  school: response.school.name,
  attackSave: parseSave(response.dc),
  damageType: parseDamageType(response),
  description: parseDescription(response),
});
