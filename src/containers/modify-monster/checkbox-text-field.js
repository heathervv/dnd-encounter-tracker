import MDEditor from '@uiw/react-md-editor/nohighlight'

const CheckboxTextField = ({ checkboxFieldName, checkboxFieldOnChange, checkboxFieldValue, textFieldName, textFieldOnChange, textFieldValue }) => {
    return (
        <div style={{ width: '100%' }}>
            <label>
                <input type="checkbox" checked={checkboxFieldValue} name={checkboxFieldName} value={true} onChange={checkboxFieldOnChange} />{checkboxFieldName}
            </label>
            {checkboxFieldValue && (
                <label>
                    {textFieldName}
                    <MDEditor
                        value={textFieldValue}
                        onChange={textFieldOnChange}
                    />
                </label>
            )}
        </div>
    )
}

export default CheckboxTextField
