import { useCallback, useMemo, useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import MDEditor from "@uiw/react-md-editor/nohighlight"
import { v4 as uuidv4 } from "uuid"
import { useMonstersContext } from "../../context/monsters/monsters-context"
import { useThemeContext } from "../../context/theme/theme-context"
import CheckboxTextField from "./checkbox-text-field"
import CustomList from "./custom-list"
import SavingThrows from "./saving-throws"

// This component is arguably gross, and maybe I'll refactor it one day.
// However I want a functional thing more than I want pretty code.
// @TODO(): a refactor could go a long ways here.

const ModifyMonster = ({ isEdit }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getSingleMonster, createMonster, updateMonster } =
    useMonstersContext()
  const { wysiwygMode } = useThemeContext()

  const [form, setForm] = useState({
    name: "",
    type: "",
    size: "",
    aligment: "",
    challengeRating: "",
    specialTraits: "",
    actionsDescription: "",
    reactionsDescription: "",
    monsterCharacteristicsDescription: "",
    bonusActionsDescription: "",
    isLegendary: false,
    legendaryActionsDescription: "",
    isMythic: false,
    mythicActionsDescription: "",
    hasLair: false,
    lairActionsDescription: "",
    armorClass: "",
    armorClassType: "",
    passivePerception: "",
    hitPointsDieCount: "",
    hitPointsDieValue: "",
    hitPointsDieModifier: "",
    averageHitPoints: "",
    strength: "",
    dexterity: "",
    constitution: "",
    intelligence: "",
    wisdom: "",
    charisma: "",
    savingThrowProficiencies: [],
    damageVulnerabilities: "",
    damageResistances: "",
    damageImmunities: "",
    conditionImmunities: "",
    language: "",
    senses: [],
    skills: [],
    movement: [],
  })

  const monster = useMemo(() => getSingleMonster?.(id), [id, getSingleMonster])

  useEffect(() => {
    if (monster) {
      setForm(monster)
    }
  }, [monster])

  const handleFieldChange = (e, name) => {
    const value = e?.target ? e?.target.value : e
    setForm({ ...form, [name]: value })
  }

  const handleListChange = (e, name) => {
    setForm({ ...form, [name]: e })
  }

  const handleSave = useCallback(
    (e) => {
      e?.preventDefault()
      const id = isEdit ? monster.id : uuidv4()

      const monsterData = {
        ...form,
        id,
      }

      if (isEdit) {
        updateMonster(monsterData)
      } else {
        createMonster(monsterData)
      }

      navigate(`/monster/${id}`)
    },
    [isEdit, monster, form, createMonster, updateMonster, navigate]
  )

  return (
    <section className="max-w-4xl m-auto" data-color-mode={wysiwygMode}>
      <h1 className="text-base-content font-semibold text-lg mb-2">
        {isEdit ? `Edit ${monster?.name}` : "Create monster"}
      </h1>
      <form onSubmit={handleSave}>
        <div className="flex gap-2">
          <label className="grow">
            <span className="block text-sm text-base-content">Name*:</span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="text"
              required
              name="name"
              value={form.name}
              onChange={(e) => handleFieldChange(e, "name")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">Type*:</span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="text"
              required
              name="type"
              value={form.type}
              onChange={(e) => handleFieldChange(e, "type")}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <label className="grow">
            <span className="block text-sm text-base-content">Size*:</span>
            <div className="select-wrapper">
              <select
                className="input input-sm input-border w-full items-center mt-1 mb-4"
                required
                name="size"
                value={form.size}
                onChange={(e) => handleFieldChange(e, "size")}
              >
                <option disabled value="">
                  -
                </option>
                <option value="Gargantuan">Gargantuan</option>
                <option value="Huge">Huge</option>
                <option value="Large">Large</option>
                <option value="Medium">Medium</option>
                <option value="Medium or small">Medium or small</option>
                <option value="Small">Small</option>
                <option value="Tiny">Tiny</option>
              </select>
            </div>
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">Alignment*:</span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="text"
              name="alignment"
              value={form.alignment}
              onChange={(e) => handleFieldChange(e, "alignment")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">
              Challenge Rating*:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="challengeRating"
              value={form.challengeRating}
              onChange={(e) => handleFieldChange(e, "challengeRating")}
            />
          </label>
        </div>
        <hr className="mb-4 border-base-content/10" />
        <div className="alert alert-info text-xs text-info-content mb-4">
          <p className="font-bold">Helpful hints:</p>
          <p>
            Use <code>[spell]Name of spell[/spell]</code> to access the details
            of the spell outside of this edit view.
          </p>
        </div>
        <div className="flex gap-2 mb-4">
          <label className="grow">
            <span className="block text-sm text-base-content mb-2">
              Special Traits:
            </span>
            <MDEditor
              value={form.specialTraits}
              onChange={(e) => handleFieldChange(e, "specialTraits")}
            />
          </label>
        </div>
        <div className="flex gap-2 mb-4">
          <label className="grow">
            <span className="block text-sm text-base-content mb-2">
              Actions description:
            </span>
            <MDEditor
              value={form.actionsDescription}
              onChange={(e) => handleFieldChange(e, "actionsDescription")}
            />
          </label>
        </div>
        <div className="flex gap-2 mb-4">
          <label className="grow">
            <span className="block text-sm text-base-content mb-2">
              Reactions description:
            </span>
            <MDEditor
              value={form.reactionsDescription}
              onChange={(e) => handleFieldChange(e, "reactionsDescription")}
            />
          </label>
        </div>
        <div className="flex gap-2 mb-4">
          <label className="grow">
            <span className="block text-sm text-base-content mb-2">
              Monster characteristics description:
            </span>
            <MDEditor
              value={form.monsterCharacteristicsDescription}
              onChange={(e) =>
                handleFieldChange(e, "monsterCharacteristicsDescription")
              }
            />
          </label>
        </div>
        <div className="flex gap-2">
          <label className="grow">
            <span className="block text-sm text-base-content mb-2">
              Bonus Actions description:
            </span>
            <MDEditor
              value={form.bonusActionsDescription}
              onChange={(e) => handleFieldChange(e, "bonusActionsDescription")}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <CheckboxTextField
            checkboxFieldName="Is Legendary?"
            checkboxFieldValue={form.isLegendary}
            checkboxFieldOnChange={() =>
              handleFieldChange(!form.isLegendary, "isLegendary")
            }
            textFieldName="Legendary Actions Description"
            textFieldOnChange={(e) =>
              handleFieldChange(e, "legendaryActionsDescription")
            }
            textFieldValue={form.legendaryActionsDescription}
          />
        </div>
        <div className="flex gap-2">
          <CheckboxTextField
            checkboxFieldName="Is Mythic?"
            checkboxFieldValue={form.isMythic}
            checkboxFieldOnChange={() =>
              handleFieldChange(!form.isMythic, "isMythic")
            }
            textFieldName="Mythic Actions Description"
            textFieldOnChange={(e) =>
              handleFieldChange(e, "mythicActionsDescription")
            }
            textFieldValue={form.mythicActionsDescription}
          />
        </div>
        <div className="flex gap-2">
          <CheckboxTextField
            checkboxFieldName="Has Lair?"
            checkboxFieldValue={form.hasLair}
            checkboxFieldOnChange={() =>
              handleFieldChange(!form.hasLair, "hasLair")
            }
            textFieldName="Lair Actions Description"
            textFieldOnChange={(e) =>
              handleFieldChange(e, "lairActionsDescription")
            }
            textFieldValue={form.lairActionsDescription}
          />
        </div>
        <div className="flex gap-2 mt-4">
          <label className="grow">
            <span className="block text-sm text-base-content">
              Armor Class*:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="armorClass"
              value={form.armorClass}
              onChange={(e) => handleFieldChange(e, "armorClass")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">
              Armor Class Type:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="text"
              name="armorClassType"
              value={form.armorClassType}
              onChange={(e) => handleFieldChange(e, "armorClassType")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">
              Passive Perception*:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="passivePerception"
              value={form.passivePerception}
              onChange={(e) => handleFieldChange(e, "passivePerception")}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <label className="grow">
            <span className="block text-sm text-base-content">
              Hit Points Die Count*:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="hitPointsDieCount"
              value={form.hitPointsDieCount}
              onChange={(e) => handleFieldChange(e, "hitPointsDieCount")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">
              Hit Points Die Value*:
            </span>
            <div>
              <select
                className="input input-sm input-border w-full items-center mt-1 mb-4"
                required
                name="hitPointsDieValue"
                value={form.hitPointsDieValue}
                onChange={(e) => handleFieldChange(e, "hitPointsDieValue")}
              >
                <option disabled value="">
                  -
                </option>
                <option value="d4">d4</option>
                <option value="d6">d6</option>
                <option value="d8">d8</option>
                <option value="d10">d10</option>
                <option value="d12">d12</option>
                <option value="d20">d20</option>
              </select>
            </div>
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">
              Hit Points Modifier*:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="hitPointsDieModifier"
              value={form.hitPointsDieModifier}
              onChange={(e) => handleFieldChange(e, "hitPointsDieModifier")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">
              Average Hit Points:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              name="averageHitPoints"
              value={form.averageHitPoints}
              onChange={(e) => handleFieldChange(e, "averageHitPoints")}
            />
          </label>
        </div>
        <hr className="mb-4 border-base-content/10" />
        <div className="alert alert-info text-xs text-info-content mb-4">
          <p className="font-bold">Adding ability scores:</p>
          <p>
            For the following fields, input the base score (not the modifier).
          </p>
        </div>
        <div className="flex gap-2">
          <label className="grow">
            <span className="block text-sm text-base-content">Strength*:</span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="strength"
              value={form.strength}
              onChange={(e) => handleFieldChange(e, "strength")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">Dexterity*:</span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="dexterity"
              value={form.dexterity}
              onChange={(e) => handleFieldChange(e, "dexterity")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">
              Constitution*:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="constitution"
              value={form.constitution}
              onChange={(e) => handleFieldChange(e, "constitution")}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <label className="grow">
            <span className="block text-sm text-base-content">
              Intelligence*:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="intelligence"
              value={form.intelligence}
              onChange={(e) => handleFieldChange(e, "intelligence")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">Wisdom*:</span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="wisdom"
              value={form.wisdom}
              onChange={(e) => handleFieldChange(e, "wisdom")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">Charisma*:</span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="number"
              required
              name="charisma"
              value={form.charisma}
              onChange={(e) => handleFieldChange(e, "charisma")}
            />
          </label>
        </div>
        <hr className="mb-4 border-base-content/10" />
        <div className="alert alert-info text-xs text-info-content mb-4">
          <p className="font-bold">
            Resistances, Immunities, and Vulnerabilities:
          </p>
          <p>For the following fields, write comma-separated options.</p>
        </div>
        <div className="flex gap-2">
          <label className="grow">
            <span className="block text-sm text-base-content">
              Damage Vulnerabilities:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="text"
              name="damageVulnerabilities"
              value={form.damageVulnerabilities}
              onChange={(e) => handleFieldChange(e, "damageVulnerabilities")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">
              Damage Resistances:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="text"
              name="damageResistances"
              value={form.damageResistances}
              onChange={(e) => handleFieldChange(e, "damageResistances")}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <label className="grow">
            <span className="block text-sm text-base-content">
              Damage Immunities:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="text"
              name="damageImmunities"
              value={form.damageImmunities}
              onChange={(e) => handleFieldChange(e, "damageImmunities")}
            />
          </label>
          <label className="grow">
            <span className="block text-sm text-base-content">
              Condition Immunities:
            </span>
            <input
              className="input input-sm input-border w-full items-center mt-1 mb-4"
              type="text"
              name="conditionImmunities"
              value={form.conditionImmunities}
              onChange={(e) => handleFieldChange(e, "conditionImmunities")}
            />
          </label>
        </div>
        <hr className="mb-4 border-base-content/10" />
        <SavingThrows
          fieldKey="savingThrowProficiencies"
          values={form.savingThrowProficiencies || []}
          onValueChange={(e) => handleListChange(e, "savingThrowProficiencies")}
        />
        <hr className="mb-4 border-base-content/10" />
        <CustomList
          title="Languages"
          description="Add each language your monster can speak, read, or write."
          fieldKey="language"
          values={form.language || []}
          onValueChange={(e) => handleListChange(e, "language")}
        />
        <hr className="mb-4 border-base-content/10" />
        <CustomList
          title="Senses"
          description="Add any special senses your monster possesses."
          fieldKey="senses"
          values={form.senses || []}
          onValueChange={(e) => handleListChange(e, "senses")}
        />
        <hr className="mb-4 border-base-content/10" />
        <CustomList
          title="Skills"
          description="Add any skill bonuses your monster possesses."
          fieldKey="skills"
          values={form.skills || []}
          onValueChange={(e) => handleListChange(e, "skills")}
        />
        <hr className="mb-4 border-base-content/10" />
        <CustomList
          title="Movement"
          description="Add any speed types and values your monster possesses."
          fieldKey="movement"
          values={form.movement || []}
          onValueChange={(e) => handleListChange(e, "movement")}
        />
        <hr className="mb-4 border-base-content/10" />
        <button className="btn btn-sm btn-success" type="submit">
          {isEdit ? "Save changes" : "Create monster"}
        </button>
      </form>
    </section>
  )
}

export default ModifyMonster
