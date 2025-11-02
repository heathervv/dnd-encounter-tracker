import Concentrate from "../../assets/concentrate"
import Markdown from "../../components/markdown"

const SpellModal = ({ content }) => (
  <div>
    <h2 className="text-base-content font-semibold text-lg">{content.name}</h2>
    <ul className="grid grid-cols-4 grid-rows-2 border-b border-base-content/10 pb-2 mb-2">
      <li>
        <p className="text-sm text-base-content font-semibold">Level</p>
        <p className="text-sm text-base-content">{content.level}</p>
      </li>
      <li>
        <p className="text-sm text-base-content font-semibold">Casting time</p>
        <p className="text-sm text-base-content">{content.castingTime}</p>
      </li>
      <li>
        <p className="text-sm text-base-content font-semibold">Range/Area</p>
        <p className="text-sm text-base-content">{content.range}</p>
      </li>
      <li>
        <p className="text-sm text-base-content font-semibold">Components</p>
        <p className="text-sm text-base-content">
          {content.components.join(",")}
          {content.material && " *"}
        </p>
      </li>
      <li>
        <p className="text-sm text-base-content font-semibold">Duration</p>
        <p className="text-sm text-base-content flex gap-1">
          <Concentrate
            size={20}
            color={content.concentration ? "#FC5454" : "#d0d7de"}
          />
          {content.duration}
        </p>
      </li>
      <li>
        <p className="text-sm text-base-content font-semibold">School</p>
        <p className="text-sm text-base-content">{content.school}</p>
      </li>
      <li>
        <p className="text-sm text-base-content font-semibold">Attack/Save</p>
        <p className="text-sm text-base-content">{content.attackSave}</p>
      </li>
      <li>
        <p className="text-sm text-base-content font-semibold">Damage/Effect</p>
        <p className="text-sm text-base-content">{content.damageType}</p>
      </li>
    </ul>
    <div className="markdown-wrapper-card">
      <Markdown source={content.description} />
      {content.material && (
        <p className="text-sm text-base-content">* {content.material}</p>
      )}
    </div>
  </div>
)

export default SpellModal
