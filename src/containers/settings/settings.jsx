import { useCallback, useState, useEffect } from "react";

import { exportToJson } from "../../helpers";
import { useMonstersContext } from "../../context/monsters/monsters-context";
import { usePlayerContext } from "../../context/players/players-context";
import { useEncountersContext } from "../../context/encounters/encounters-context";

export const Settings = () => {
  const { monsters, importMonsters } = useMonstersContext();
  const { players, importPlayers } = usePlayerContext();
  const { encounters, importEncounters } = useEncountersContext();

  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null);
      }, [5000]);
    }
  }, [alert]);

  const handleExport = useCallback(
    (event) => {
      event.preventDefault();

      const data = {
        monsters,
        players,
        encounters,
      };

      exportToJson(data, "combat");

      setAlert("Data successfully exported");
    },
    [monsters, players, encounters]
  );

  const handleImport = useCallback(
    (event) => {
      const fileReader = new FileReader();
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        const fileData = JSON.parse(e.target.result);

        if (fileData.monsters) {
          importMonsters(fileData.monsters);
        }
        if (fileData.players) {
          importPlayers(fileData.players);
        }
        if (fileData.encounters) {
          importEncounters(fileData.encounters);
        }

        setAlert("Data successfully uploaded");

        event.target.value = null;
      };
    },
    [importMonsters, importPlayers, importEncounters]
  );

  return (
    <>
      <section className="max-w-4xl m-auto">
        <div className="mb-4">
          <h1 className="text-base-content font-semibold text-lg">Settings</h1>
          <p className="text-base-content">
            This is a browser-based tool that keeps all your data local.
            Specifically, your data is saved in the localstorage of whichever
            browser you are using. If you'd like to switch to using a different
            device (or browser), please follow these steps:
          </p>
          <ol className="list-decimal pl-4 pt-4 pb-2">
            <li className="pb-1">
              Export your encounter data from the browser that you've been using
              with the "export" button below.
            </li>
            <li>
              Upload your encounter data into the browser you'd like to use with
              the "import" button below.
            </li>
          </ol>
          <p className="italic">
            This will contain all your encounters, monsters, and player
            character data.
          </p>
        </div>
        <div className="mt-4">
          <button
            className="btn btn-xs btn-primary mr-2"
            type="button"
            onClick={handleExport}
          >
            Export all data
          </button>
          <div className="btn btn-xs btn-error">
            <label onChange={handleImport} htmlFor="file">
              <input
                name=""
                type="file"
                accept="application/json"
                id="file"
                hidden
              />
              Import data <em>(destructive)</em>
            </label>
          </div>
        </div>
      </section>
      <section className="max-w-4xl m-auto mt-4">
        <h2 className="text-base-content font-semibold">Credits</h2>
        <p>
          D&D 5e SRD API (
          <a
            className="link"
            target="_blank"
            href="https://5e-bits.github.io/docs/"
          >
            link to website
          </a>
          ) is used to enrich all spell data and surface available monsters when
          creating encounters.
        </p>
      </section>
      <hr className="max-w-4xl m-auto mt-6 mb-4 border-base-content/10" />
      <section className="max-w-4xl m-auto mt-4 alert alert-dash alert-warning">
        <div>
          <h3 className="text-base-content font-semibold text-lg">
            Something missing?
          </h3>
          <p className="text-base-content">
            Maybe there's a bug, or a feature you'd like to see supported.
            Either way, email me at{" "}
            <a
              className="link"
              target="_blank"
              href="mailto:heathervandervecht@gmail.com"
            >
              heathervandervecht@gmail.com
            </a>
            .
          </p>
        </div>
      </section>
      {alert && (
        <div className="fixed bottom-4 left-4 alert alert-success text-xs font-bold">
          {alert}
        </div>
      )}
    </>
  );
};

export default Settings;
