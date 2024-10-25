import { useCallback, useState, useEffect } from 'react'

import { exportToJson } from '../../helpers'
import { useMonstersContext } from '../../context/monsters/monsters-context'
import { usePlayerContext } from '../../context/players/players-context'
import { useEncountersContext } from '../../context/encounters/encounters-context'

import './manage-data.css'

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

    const handleExport = useCallback((event) => {
        event.preventDefault()
        
        const data = {
            monsters,
            players,
            encounters
        }

        exportToJson(data, 'combat')

        setAlert('Data successfully exported')
    }, [monsters, players, encounters])

    const handleImport = useCallback((event) => {
        const fileReader = new FileReader()
        fileReader.readAsText(event.target.files[0], "UTF-8")
        fileReader.onload = e => {
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

            setAlert('Data successfully uploaded')

            event.target.value = null
        }
    }, [importMonsters, importPlayers, importEncounters])

    return (
        <section className="wrapper">
            <div className="header">
                <div>
                    <h1>Manage data</h1>
                    <p>Export or import your encounters, monsters, and player characters.</p>
                </div>
            </div>
        <div className="manage-data">
            <button type="button" onClick={handleExport}>Export all data</button>
            <div className="import">
                <label onChange={handleImport} htmlFor="file" className="file-selector">
                    <input name="" type="file" accept="application/json" id="file" hidden />
                    Import data <em>(destructive)</em>
                </label>
            </div>
        </div>
        {alert && <div className="alert">{alert}</div>}
        </section>
    )
}

export default ManageData