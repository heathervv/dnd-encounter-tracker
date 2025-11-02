type ToggleProps = {
    LeftOption: React.FC<{ className?: string }>,
    RightOption: React.FC<{ className?: string }>,
    value: string,
    checked: boolean
    onToggle: () => void
}

const Toggle = ({ LeftOption, RightOption, value, checked, onToggle }: ToggleProps) => (
    <label className="flex items-center cursor-pointer gap-1">
        <span className="label-text text-sm pr-0.5">
            <LeftOption className="w-4 h-4 text-base-content" />
        </span>
        <input
            type="checkbox"
            className="toggle toggle-xs text-base-content/75"
            value={value}
            checked={checked}
            onChange={onToggle} />
        <span className="label-text text-sm">
            <RightOption className="w-4 h-4 text-base-content" />
        </span>
    </label>
)

export default Toggle