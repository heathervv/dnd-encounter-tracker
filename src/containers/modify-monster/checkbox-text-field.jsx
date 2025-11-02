import MDEditor from "@uiw/react-md-editor/nohighlight"

const CheckboxTextField = ({
  checkboxFieldName,
  checkboxFieldOnChange,
  checkboxFieldValue,
  textFieldName,
  textFieldOnChange,
  textFieldValue,
}) => {
  return (
    <div className="w-full mt-4">
      <label>
        <input
          className="checkbox checkbox-sm"
          type="checkbox"
          checked={checkboxFieldValue}
          name={checkboxFieldName}
          value={true}
          onChange={checkboxFieldOnChange}
        />
        <span className="text-sm text-base-content ml-2">
          {checkboxFieldName}
        </span>
      </label>
      {checkboxFieldValue && (
        <div className="mt-2">
          <label>
            <span className="block text-sm text-base-content mb-2">
              {textFieldName}:
            </span>
            <MDEditor value={textFieldValue} onChange={textFieldOnChange} />
          </label>
        </div>
      )}
    </div>
  )
}

export default CheckboxTextField
