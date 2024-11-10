import Markdown from "../../components/markdown";
import "./spell-modal.css";


const SpellModal = ({ content }) => (
  <div className="spellModal">
    <h2>{content.name}</h2>
    <div>
      <ul className="spellStats">
        <li className="spellStat">
          <p>Level</p>
          <p>{content.level}</p>
        </li>
        <li className="spellStat">
          <p>Casting time</p>
          <p>{content.castingTime}</p>
        </li>
        <li className="spellStat">
          <p>Range/Area</p>
          <p>{content.range}</p>
        </li>
        <li className="spellStat">
          <p>Components</p>
          <p>
            {content.components.join(",")}
            {content.material && " *"}
          </p>
        </li>
        <li className="spellStat">
          <p>Duration</p>
          <p className="alignHorizontal">
            {content.concentration && <span className="concentration">c</span>}
            {content.duration}
          </p>
        </li>
        <li className="spellStat">
          <p>School</p>
          <p>{content.school}</p>
        </li>
        <li className="spellStat">
          <p>Attack/Save</p>
          <p>{content.attackSave}</p>
        </li>
        <li className="spellStat">
          <p>Damage/Effect</p>
          <p>{content.damageType}</p>
        </li>
      </ul>
    </div>
    <div className="spellContent">
      <Markdown source={content.description} />
      {content.material && <p className="materials">* {content.material}</p>}
    </div>
  </div>
);

export default SpellModal;
