import { useCallback, useEffect, useState } from "react"
import Markdown from "../../components/markdown"
import Modal from "../../components/modal/modal"
import SpellModal from "./spell-modal"
import { baseAbilityScoreModifier, mapProficiencyBonus } from "../../helpers"
import type { TransformedSpell } from "../../api/types"
import type { Monster, ListItem } from "../../types/domain"

type MonsterCardProps = {
  monster: Monster
  className?: string
}

type AbilityScoreKey =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma"

const ABILITY_KEY_MAP: Record<string, AbilityScoreKey> = {
  strength: "strength",
  dexterity: "dexterity",
  constitution: "constitution",
  intelligence: "intelligence",
  wisdom: "wisdom",
  charisma: "charisma",
}

const toNumber = (value: number | string | undefined): number => Number(value || 0)

const MonsterCard = ({ monster, className }: MonsterCardProps) => {
  const [openModalData, setOpenModalData] = useState<TransformedSpell | null>(null)
  const [alert, setAlert] = useState<string | null>(null)

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null)
      }, 5000)
    }
  }, [alert])

  const handleOpenModal = (data: TransformedSpell | null) => {
    if (data) {
      setOpenModalData(data)
    } else {
      setAlert("Spell not found")
    }
  }

  const handleCloseModal = () => {
    setOpenModalData(null)
  }

  const mapMovement = useCallback(() => {
    const movements = (monster.movement || []).map((type) => {
      if (type.name.toLowerCase() === "walk") {
        return String(type.note || "")
      }

      return `${type.name} ${String(type.note || "")}`
    })

    return movements.join(", ")
  }, [monster])

  const mapPrettyAbilityScore = useCallback((ability: number | string) => {
    const score = baseAbilityScoreModifier(toNumber(ability))
    return score > 0 ? `+${score}` : `${score}`
  }, [])

  const mapList = useCallback((attribute: ListItem[]) => {
    const mapped = (attribute || []).map((type) =>
      type.note ? `${type.name} ${String(type.note)}` : type.name
    )

    return mapped.length === 1 && mapped[0] === "" ? "None" : mapped.join(", ")
  }, [])

  const mapSavingThrowProficiencies = useCallback(() => {
    const mapped = (monster.savingThrowProficiencies || []).map((st) => {
      const key = ABILITY_KEY_MAP[st.ability.toLowerCase()]
      const abilityScore = key ? monster[key] : 0
      const abilityScoreModifier = baseAbilityScoreModifier(toNumber(abilityScore))
      const totalModifier =
        abilityScoreModifier + mapProficiencyBonus(toNumber(monster.challengeRating))

      return `${st.ability} +${totalModifier}`
    })

    return mapped.join(", ")
  }, [monster])

  return (
    <>
      <div
        className={
          className ||
          "card bg-base-100 card-border border-base-300 card-sm mb-2 shadow-xs"
        }
      >
        <div className="card-body py-2 px-4 block col-count-2 gap-4">
          <div className="border-b border-base-content/10 pb-2 mb-2">
            <p className="text-base text-base-content font-semibold">
              {monster.name}
            </p>
            <p className="text-sm text-base-content italic">
              {monster.size} {monster.type}
              {monster.alignment ? `, ${monster.alignment}` : ""}
            </p>
          </div>
          <ul className="border-b border-base-content/10 pb-2 mb-2">
            <li className="grid grid-cols-[0.5fr_1fr] gap-1">
              <p className="text-sm text-base-content font-semibold">
                Armor class:
              </p>
              <p className="text-sm text-base-content">
                {monster.armorClass}{" "}
                {monster.armorClassType ? monster.armorClassType : ""}
              </p>
            </li>
            <li className="grid grid-cols-[0.5fr_1fr] gap-1">
              <p className="text-sm text-base-content font-semibold">
                Hit points:
              </p>
              <p className="text-sm text-base-content">
                {monster.averageHitPoints} ({monster.hitPointsDieCount}
                {monster.hitPointsDieValue}
                {toNumber(monster.hitPointsDieModifier) > 0
                  ? ` + ${monster.hitPointsDieModifier}`
                  : ""}
                )
              </p>
            </li>
            <li className="grid grid-cols-[0.5fr_1fr] gap-1">
              <p className="text-sm text-base-content font-semibold">Speed:</p>
              <p className="text-sm text-base-content">{mapMovement()}</p>
            </li>
          </ul>
          <ul className="border-b border-base-content/10 pb-2 mb-2 flex justify-between">
            <li className="text-center">
              <p className="text-sm text-base-content font-semibold">STR</p>
              <p className="text-sm text-base-content">
                {monster.strength} ({mapPrettyAbilityScore(monster.strength)})
              </p>
            </li>
            <li className="text-center">
              <p className="text-sm text-base-content font-semibold">DEX</p>
              <p className="text-sm text-base-content">
                {monster.dexterity} ({mapPrettyAbilityScore(monster.dexterity)})
              </p>
            </li>
            <li className="text-center">
              <p className="text-sm text-base-content font-semibold">CON</p>
              <p className="text-sm text-base-content">
                {monster.constitution} (
                {mapPrettyAbilityScore(monster.constitution)})
              </p>
            </li>
            <li className="text-center">
              <p className="text-sm text-base-content font-semibold">INT</p>
              <p className="text-sm text-base-content">
                {monster.intelligence} (
                {mapPrettyAbilityScore(monster.intelligence)})
              </p>
            </li>
            <li className="text-center">
              <p className="text-sm text-base-content font-semibold">WIS</p>
              <p className="text-sm text-base-content">
                {monster.wisdom} ({mapPrettyAbilityScore(monster.wisdom)})
              </p>
            </li>
            <li className="text-center">
              <p className="text-sm text-base-content font-semibold">CHA</p>
              <p className="text-sm text-base-content">
                {monster.charisma} ({mapPrettyAbilityScore(monster.charisma)})
              </p>
            </li>
          </ul>
          <ul className="border-b border-base-content/10 pb-2 mb-2">
            {(monster.savingThrowProficiencies || []).length > 0 && (
              <li className="grid grid-cols-[0.5fr_1fr] gap-1">
                <p className="text-sm text-base-content font-semibold">
                  Saving throws
                </p>
                <p className="text-sm text-base-content">
                  {mapSavingThrowProficiencies()}
                </p>
              </li>
            )}
            {(monster.skills || []).length > 0 && (
              <li className="grid grid-cols-[0.5fr_1fr] gap-1">
                <p className="text-sm text-base-content font-semibold">
                  Skills
                </p>
                <p className="text-sm text-base-content">
                  {mapList(monster.skills)}
                </p>
              </li>
            )}
            {monster.damageVulnerabilities && (
              <li className="grid grid-cols-[0.5fr_1fr] gap-1">
                <p className="text-sm text-base-content font-semibold">
                  Damage Vulnerabilities
                </p>
                <p className="text-sm text-base-content">
                  {monster.damageVulnerabilities}
                </p>
              </li>
            )}
            {monster.damageResistances && (
              <li className="grid grid-cols-[0.5fr_1fr] gap-1">
                <p className="text-sm text-base-content font-semibold">
                  Damage Resistances
                </p>
                <p className="text-sm text-base-content">
                  {monster.damageResistances}
                </p>
              </li>
            )}
            {monster.damageImmunities && (
              <li className="grid grid-cols-[0.5fr_1fr] gap-1">
                <p className="text-sm text-base-content font-semibold">
                  Damage Immunities
                </p>
                <p className="text-sm text-base-content">
                  {monster.damageImmunities}
                </p>
              </li>
            )}
            {monster.conditionImmunities && (
              <li className="grid grid-cols-[0.5fr_1fr] gap-1">
                <p className="text-sm text-base-content font-semibold">
                  Condition Immunities
                </p>
                <p className="text-sm text-base-content">
                  {monster.conditionImmunities}
                </p>
              </li>
            )}
            <li className="grid grid-cols-[0.5fr_1fr] gap-1">
              <p className="text-sm text-base-content font-semibold">Senses</p>
              <p className="text-sm text-base-content">
                {(monster.senses || []).length > 0 && mapList(monster.senses)}{" "}
                Passive Perception {monster.passivePerception}
              </p>
            </li>
            {(monster.language || []).length > 0 && (
              <li className="grid grid-cols-[0.5fr_1fr] gap-1">
                <p className="text-sm text-base-content font-semibold">
                  Languages
                </p>
                <p className="text-sm text-base-content">
                  {mapList(monster.language)}
                </p>
              </li>
            )}
            <li className="grid grid-cols-[0.5fr_1fr] gap-1">
              <div>
                <p className="text-sm text-base-content font-semibold">
                  Challenge
                </p>
                <p className="text-sm text-base-content">
                  {monster.challengeRating}
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content font-semibold">
                  Proficiency Bonus
                </p>
                <p className="text-sm text-base-content">
                  +{mapProficiencyBonus(toNumber(monster.challengeRating))}
                </p>
              </div>
            </li>
          </ul>
          {monster.specialTraits && (
            <div className="markdown-wrapper-card">
              <Markdown
                source={monster.specialTraits}
                openModal={handleOpenModal}
              />
            </div>
          )}
          {monster.actionsDescription && (
            <div className="markdown-wrapper-card">
              <h3 className="text-lg mt-2 border-b border-base-content/10 mb-1">
                Actions
              </h3>
              <Markdown
                source={monster.actionsDescription}
                openModal={handleOpenModal}
              />
            </div>
          )}
          {monster.bonusActionsDescription && (
            <div className="markdown-wrapper-card">
              <h3 className="text-lg mt-2 border-b border-base-content/10 mb-1">
                Bonus Actions
              </h3>
              <Markdown
                source={monster.bonusActionsDescription}
                openModal={handleOpenModal}
              />
            </div>
          )}
          {monster.reactionsDescription && (
            <div className="markdown-wrapper-card">
              <h3 className="text-lg mt-2 border-b border-base-content/10 mb-1">
                Reactions
              </h3>
              <Markdown
                source={monster.reactionsDescription}
                openModal={handleOpenModal}
              />
            </div>
          )}
          {monster.isLegendary && monster.legendaryActionsDescription && (
            <div className="markdown-wrapper-card">
              <h3 className="text-lg mt-2 border-b border-base-content/10 mb-1">
                Legendary Actions
              </h3>
              <Markdown
                source={monster.legendaryActionsDescription}
                openModal={handleOpenModal}
              />
            </div>
          )}
          {monster.isMythic && monster.mythicActionsDescription && (
            <div className="markdown-wrapper-card">
              <h3 className="text-lg mt-2 border-b border-base-content/10 mb-1">
                Mythical Actions
              </h3>
              <Markdown
                source={monster.mythicActionsDescription}
                openModal={handleOpenModal}
              />
            </div>
          )}
        </div>
      </div>
      <Modal open={!!openModalData} onClose={handleCloseModal}>
        {openModalData && <SpellModal content={openModalData} />}
      </Modal>
      {alert && (
        <div className="fixed bottom-4 left-4 alert alert-error text-xs font-bold text-error-content">
          {alert}
        </div>
      )}
    </>
  )
}

export default MonsterCard
