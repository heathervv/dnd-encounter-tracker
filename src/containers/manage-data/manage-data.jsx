import { useCallback, useState, useEffect } from "react"

import { exportToJson } from "../../helpers"
import { useMonstersContext } from "../../context/monsters/monsters-context"
import { usePlayerContext } from "../../context/players/players-context"
import { useEncountersContext } from "../../context/encounters/encounters-context"

export const ManageData = () => {
  const { monsters, importMonsters } = useMonstersContext()
  const { players, importPlayers } = usePlayerContext()
  const { encounters, importEncounters } = useEncountersContext()

  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null)
      }, [5000])
    }
  }, [alert])

  const handleExport = useCallback(
    (event) => {
      event.preventDefault()

      const data = {
        monsters,
        players,
        encounters,
      }

      exportToJson(data, "combat")

      setAlert("Data successfully exported")
    },
    [monsters, players, encounters]
  )

  const handleImport = useCallback(
    (event) => {
      const fileReader = new FileReader()
      fileReader.readAsText(event.target.files[0], "UTF-8")
      fileReader.onload = (e) => {
        const fileData = JSON.parse(e.target.result)

        if (fileData.monsters) {
          importMonsters(fileData.monsters)
        }
        if (fileData.players) {
          importPlayers(fileData.players)
        }
        if (fileData.encounters) {
          importEncounters(fileData.encounters)
        }

        setAlert("Data successfully uploaded")

        event.target.value = null
      }
    },
    [importMonsters, importPlayers, importEncounters]
  )

  return (
    <section className="max-w-4xl m-auto">
      <div>
        <h1 className="text-base-content font-semibold text-lg">Manage data</h1>
        <p className="text-base-content">
          Export or import your encounters, monsters, and player characters.
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
      {alert && (
        <div className="fixed bottom-4 left-4 alert alert-success text-xs font-bold">
          {alert}
        </div>
      )}
    </section>
  )
}

export default ManageData
