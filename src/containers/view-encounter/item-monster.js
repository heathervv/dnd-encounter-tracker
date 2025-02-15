const MonsterItem = ({
    monsterId,
    monsterCard,
    showMonsterCard,
    monster,
    encounter,
}) => (
    <li key={monsterId}>
        <button
            className={monsterCard?.id === monsterId ? 'selected' : ''}
            type="button"
            onClick={() => showMonsterCard(monster)}
        >
            <div>
                <p>{monster.name}</p>
                <p>
                    {monster.size} {monster.type}
                </p>
            </div>
            {encounter?.amounts?.[monsterId] > 1 && (
                <div className="count">
                    <p>x {encounter?.amounts?.[monsterId]}</p>
                </div>
            )}
        </button>
    </li>
)

export default MonsterItem
