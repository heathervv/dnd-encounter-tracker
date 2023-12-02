import { useCallback, useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { useMonstersContext } from "../../context/monsters/monsters-context";
import CheckboxTextField from './checkbox-text-field';
import CustomList from './custom-list';
import './modify-monster.css'

// This component is arguably gross, and maybe I'll refactor it one day.
// However I want a functional thing more than I want pretty code.

const ModifyMonster = ({ isEdit }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getSingleMonster, createMonster, updateMonster } = useMonstersContext()
    const [form, setForm] = useState({
        name: '',
        type: '',
        size: '-',
        aligment: '',
        specialTraits: '',
        actionsDescription: '',
        reactionsDescription: '',
        monsterCharacteristicsDescription: '',
        bonusActionsDescription: '',
        isLegendary: false,
        legendaryActionsDescription: '',
        isMythic: false,
        mythicActionsDescription: '',
        hasLair: false,
        lairActionsDescription: '',
        armorClass: '',
        armorClassType: '',
        passivePerception: '',
        hitPointsDieCount: '',
        hitPointsDieValue: '',
        hitPointsDieModifier: '',
        averageHitPoints: '',
        strength: '',
        dexterity: '',
        constitution: '',
        intelligence: '',
        wisdom: '',
        charisma: '',
        savingThrowProficiencies: '',
        damageAdjustments: '',
        conditionImmunities: '',
        language: '',
        senses: [],
        skills: [],
        movement: []
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

    const handleSave = useCallback((e) => {
        e?.preventDefault();
        const id = isEdit ? monster.id : uuidv4()

        const monsterData = {
            ...form,
            id
        }

        if (isEdit) {
            updateMonster(monsterData)
        } else {
            createMonster(monsterData)
        }

        navigate(`/monster/${id}`)
    }, [isEdit, monster, form, createMonster, updateMonster, navigate])

    return (
        <section>
            <form onSubmit={handleSave}>
                <label>
                    Name*: <input required name="name" value={form.name} onChange={(e) => handleFieldChange(e, 'name')} />
                </label>
                <label>
                    Type*: <input required name="type" value={form.type} onChange={(e) => handleFieldChange(e, 'type')} />
                </label>
                <label>
                    Size*: <select required name="size" value={form.size} onChange={(e) => handleFieldChange(e, 'size')}>
                        <option disabled value="-">-</option>
                        <option value="Gargantuan">Gargantuan</option>
                        <option value="Huge">Huge</option>
                        <option value="Large">Large</option>
                        <option value="Medium">Medium</option>
                        <option value="Medium or small">Medium or small</option>
                        <option value="Small">Small</option>
                        <option value="Tiny">Tiny</option>
                    </select>
                </label>
                <label>
                    Alignment: <input name="alignment" value={form.alignment} onChange={(e) => handleFieldChange(e, 'alignment')} />
                </label>
                <hr />
                <label>
                    Special Traits: <textarea name="specialTraits" value={form.specialTraits} onChange={(e) => handleFieldChange(e, 'specialTraits')} />
                </label>
                <label>
                    Actions description: <textarea name="actionsDescription" value={form.actionsDescription} onChange={(e) => handleFieldChange(e, 'actionsDescription')} />
                </label>
                <label>
                    Reactions description: <textarea name="reactionsDescription" value={form.reactionsDescription} onChange={(e) => handleFieldChange(e, 'reactionsDescription')} />
                </label>
                <label>
                    Monster characteristics description: <textarea name="monsterCharacteristicsDescription" value={form.monsterCharacteristicsDescription} onChange={(e) => handleFieldChange(e, 'monsterCharacteristicsDescription')} />
                </label>
                <label>
                    Bonus Actions description: <textarea name="bonusActionsDescription" value={form.bonusActionsDescription} onChange={(e) => handleFieldChange(e, 'bonusActionsDescription')} />
                </label>
                <CheckboxTextField
                    checkboxFieldName="Is Legendary"
                    checkboxFieldValue={form.isLegendary}
                    checkboxFieldOnChange={() => handleFieldChange(!form.isLegendary, 'isLegendary')}
                    textFieldName="Legendary Actions Description"
                    textFieldOnChange={(e) => handleFieldChange(e, 'legendaryActionsDescription')}
                    textFieldValue={form.legendaryActionsDescription}
                />
                <CheckboxTextField
                    checkboxFieldName="Is Mythic"
                    checkboxFieldValue={form.isMythic}
                    checkboxFieldOnChange={() => handleFieldChange(!form.isMythic, 'isMythic')}
                    textFieldName="Mythic Actions Description"
                    textFieldOnChange={(e) => handleFieldChange(e, 'mythicActionsDescription')}
                    textFieldValue={form.mythicActionsDescription}
                />
                <CheckboxTextField
                    checkboxFieldName="Has Lair"
                    checkboxFieldValue={form.hasLair}
                    checkboxFieldOnChange={() => handleFieldChange(!form.hasLair, 'hasLair')}
                    textFieldName="Lair Actions Description"
                    textFieldOnChange={(e) => handleFieldChange(e, 'lairActionsDescription')}
                    textFieldValue={form.lairActionsDescription}
                />
                <label>
                    Armor Class*: <input type="number" required name="armorClass" value={form.armorClass} onChange={(e) => handleFieldChange(e, 'armorClass')} />
                </label>
                <label>
                    Armor Class Type*: <input required name="armorClassType" value={form.armorClassType} onChange={(e) => handleFieldChange(e, 'armorClassType')} />
                </label>
                <label>
                    Passive Perception*: <input type="number" required name="passivePerception" value={form.passivePerception} onChange={(e) => handleFieldChange(e, 'passivePerception')} />
                </label>
                <label>
                    Hit Points Die Count*: <input type="number" required name="hitPointsDieCount" value={form.hitPointsDieCount} onChange={(e) => handleFieldChange(e, 'hitPointsDieCount')} />
                </label>
                <label>
                    Hit Points Die Value*: <input type="number" required name="hitPointsDieValue" value={form.hitPointsDieValue} onChange={(e) => handleFieldChange(e, 'hitPointsDieValue')} />
                </label>
                <label>
                    Hit Points Modifier*: <input type="number" required name="hitPointsDieModifier" value={form.hitPointsDieModifier} onChange={(e) => handleFieldChange(e, 'hitPointsDieModifier')} />
                </label>
                <label>
                    Average Hit Points: <input type="number" name="averageHitPoints" value={form.averageHitPoints} onChange={(e) => handleFieldChange(e, 'averageHitPoints')} />
                </label>
                <hr />
                <p>For the following, input the base score (not the modifier).</p>
                <label>
                    Strength*: <input type="number" required name="strength" value={form.strength} onChange={(e) => handleFieldChange(e, 'strength')} />
                </label>
                <label>
                    Dexterity*: <input type="number" required name="dexterity" value={form.dexterity} onChange={(e) => handleFieldChange(e, 'dexterity')} />
                </label>
                <label>
                    Constitution*: <input type="number" required name="constitution" value={form.constitution} onChange={(e) => handleFieldChange(e, 'constitution')} />
                </label>
                <label>
                    Intelligence*: <input type="number" required name="intelligence" value={form.intelligence} onChange={(e) => handleFieldChange(e, 'intelligence')} />
                </label>
                <label>
                    Wisdom*: <input type="number" required name="wisdom" value={form.wisdom} onChange={(e) => handleFieldChange(e, 'wisdom')} />
                </label>
                <label>
                    Charisma*: <input type="number" required name="charisma" value={form.charisma} onChange={(e) => handleFieldChange(e, 'charisma')} />
                </label>
                <hr />
                <p>For the following, write comma-separated options.</p>
                <label>
                    Saving Throw Proficiences: <textarea name="savingThrowProficiencies" value={form.savingThrowProficiencies} onChange={(e) => handleFieldChange(e, 'savingThrowProficiencies')} />
                </label>
                <label>
                    Damage adjustments: <textarea name="damageAdjustments" value={form.damageAdjustments} onChange={(e) => handleFieldChange(e, 'damageAdjustments')} />
                </label>
                <label>
                    Condition immunities: <textarea name="conditionImmunities" value={form.conditionImmunities} onChange={(e) => handleFieldChange(e, 'conditionImmunities')} />
                </label>
                <hr />
                <CustomList
                    title="Languages"
                    description="Add each language your monster can speak, read, or write."
                    fieldKey="language"
                    values={form.language || []}
                    onValueChange={(e) => handleListChange(e, 'language')}
                />
                <hr />
                <CustomList
                    title="Senses"
                    description="Add any special senses your monster possesses."
                    fieldKey="senses"
                    values={form.senses || []}
                    onValueChange={(e) => handleListChange(e, 'senses')}
                />
                <hr />
                <CustomList
                    title="Skills"
                    description="Add any skill bonuses your monster possesses."
                    fieldKey="skills"
                    values={form.skills || []}
                    onValueChange={(e) => handleListChange(e, 'skills')}
                />
                <hr />
                <CustomList
                    title="Movement"
                    description="Add any speed types and values your monster possesses."
                    fieldKey="movement"
                    values={form.movement || []}
                    onValueChange={(e) => handleListChange(e, 'movement')}
                />
                <hr />
                <button type="submit">Save</button>
            </form>
        </section>
    )
}

export default ModifyMonster
