import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMonstersContext } from "../../context/monsters/monsters-context";

const Monsters = () => {
  const navigate = useNavigate();
  const { monsters } = useMonstersContext();

  const handleCreateNew = useCallback(() => {
    navigate("/monster/create");
  }, [navigate]);

  return (
    <section className="max-w-4xl m-auto">
      <div className="flex justify-between items-end">
        <h1 className="text-base-content font-semibold text-lg">
          Homebrew monsters
        </h1>
        <button className="btn btn-xs btn-primary" onClick={handleCreateNew}>
          Create new
        </button>
      </div>
      {monsters.length > 0 ? (
        <ul className="mt-4">
          {monsters.map((monster) => (
            <li
              key={monster.id}
              className="card bg-base-100 card-border border-base-300 card-sm mb-2 shadow-xs"
            >
              <Link to={`/monster/${monster.id}`}>
                <div className="card-body py-2 px-4 gap-0">
                  <p className="text-base-content text-sm">{monster.name}</p>
                  <p className="text-base-content/50 text-xs italic">
                    {monster.size} {monster.type}
                    {monster.alignment ? `, ${monster.alignment}` : ""}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 card bg-base-100 card-border border-base-300 card-sm">
          <p className="card-body py-2 px-4 gap-0 text-base-content text-sm italic">
            You have not created any monsters yet.
          </p>
        </div>
      )}
    </section>
  );
};

export default Monsters;
