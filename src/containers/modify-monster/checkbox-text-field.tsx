import type { ChangeEventHandler } from "react"
import MDEditor from "@uiw/react-md-editor/nohighlight"

type CheckboxTextFieldProps = {
  checkboxFieldName: string
  checkboxFieldOnChange: ChangeEventHandler<HTMLInputElement>
  checkboxFieldValue: boolean
  textFieldName: string
  textFieldOnChange: (value?: string) => void
  textFieldValue?: string
}

const CheckboxTextField = ({
  checkboxFieldName,
  checkboxFieldOnChange,
  checkboxFieldValue,
  textFieldName,
  textFieldOnChange,
  textFieldValue,
}: CheckboxTextFieldProps) => (
  <div className="w-full mt-4">
    <label>
      <input
        className="checkbox checkbox-sm"
        type="checkbox"
        checked={checkboxFieldValue}
        name={checkboxFieldName}
        value={"true"}
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

export default CheckboxTextField
