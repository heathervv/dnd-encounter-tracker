import { useCallback } from 'react'
import './manage-data.css'

export const EXPORT_TYPE = {
    MONSTERS: 'monsters',
    ENCOUNTERS: 'encounters',
    PLAYERS: 'player characters'
}

export const ManageData = ({ onExport, onImport, type }) => {
    const handleImport = useCallback((event) => {
        const fileReader = new FileReader()
        fileReader.readAsText(event.target.files[0], "UTF-8")
        fileReader.onload = e => {
            onImport(e.target.result)
            event.target.value = null
        };
    }, [onImport])

    return (
        <div className="manage-data">
            <h3>Manage data</h3>
            <div>
                <button type="button" onClick={onExport}>Export {type}</button>
                <div className="import">
                    <label onChange={handleImport} htmlFor="file" className="file-selector">
                        <input name="" type="file" accept="application/json" id="file" hidden />
                        Import {type} <em>(replaces current list)</em>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default ManageData