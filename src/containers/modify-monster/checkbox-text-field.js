const CheckboxTextField = ({ checkboxFieldName, checkboxFieldOnChange, checkboxFieldValue, textFieldName, textFieldOnChange, textFieldValue }) => {
    return (
        <div>
            <label>
                <input type="checkbox" checked={checkboxFieldValue} name={checkboxFieldName} value={true} onChange={checkboxFieldOnChange} />{checkboxFieldName}
            </label>
            {checkboxFieldValue && (
                <label>
                    {textFieldName} <textarea name={textFieldName} value={textFieldValue} onChange={textFieldOnChange} />
                </label>
            )}
        </div>
    )
}

export default CheckboxTextField
